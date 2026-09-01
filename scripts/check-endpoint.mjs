import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync(new URL('../server.json', import.meta.url), 'utf8'));
const remote = manifest.remotes?.find((candidate) => candidate.type === 'streamable-http');

if (!remote?.url) {
  throw new Error('server.json must define a Streamable HTTP remote URL.');
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10_000);
let response;

try {
  response = await fetch(remote.url, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'stellary-registry-readiness', version: '1.0.0' },
      },
    }),
    signal: controller.signal,
  });
} finally {
  clearTimeout(timeout);
}

const contentType = response.headers.get('content-type') ?? '';
const authenticate = response.headers.get('www-authenticate') ?? '';
const body = await response.text();
const expectedChallenge =
  response.status === 401 &&
  /bearer/i.test(authenticate) &&
  /resource_metadata="https:\/\/api\.stellary\.co\/\.well-known\/oauth-protected-resource\/mcp"/i.test(
    authenticate,
  ) &&
  /scope="[^"]*projects:read[^"]*projects:write[^"]*pilotage:read[^"]*pilotage:write[^"]*"/i.test(
    authenticate,
  );

if (!expectedChallenge || !contentType.includes('application/json')) {
  throw new Error(
    `${remote.url} returned HTTP ${response.status} (${contentType || 'no content type'}) with challenge ${authenticate || 'missing'}: ${body.slice(0, 200)}`,
  );
}

const protectedResourceUrl = 'https://api.stellary.co/.well-known/oauth-protected-resource/mcp';
const authorizationServerUrl = 'https://api.stellary.co/.well-known/oauth-authorization-server';
const [protectedResourceResponse, authorizationServerResponse] = await Promise.all([
  fetch(protectedResourceUrl),
  fetch(authorizationServerUrl),
]);

if (!protectedResourceResponse.ok || !authorizationServerResponse.ok) {
  throw new Error('Stellary OAuth discovery metadata is not reachable.');
}

const protectedResource = await protectedResourceResponse.json();
const authorizationServer = await authorizationServerResponse.json();

if (
  protectedResource.resource !== remote.url ||
  !protectedResource.authorization_servers?.some(
    (issuer) => issuer === 'https://api.stellary.co' || issuer === 'https://api.stellary.co/',
  )
) {
  throw new Error('Protected resource metadata does not bind the canonical Stellary MCP resource and issuer.');
}

if (
  authorizationServer.authorization_endpoint !== 'https://api.stellary.co/authorize' ||
  authorizationServer.token_endpoint !== 'https://api.stellary.co/token' ||
  authorizationServer.registration_endpoint !== 'https://api.stellary.co/register' ||
  authorizationServer.revocation_endpoint !== 'https://api.stellary.co/revoke' ||
  !authorizationServer.code_challenge_methods_supported?.includes('S256') ||
  !authorizationServer.grant_types_supported?.includes('authorization_code') ||
  !authorizationServer.grant_types_supported?.includes('refresh_token')
) {
  throw new Error('Authorization server metadata is missing a required OAuth capability.');
}

console.log(`${remote.url} exposes the expected OAuth challenge and discovery metadata.`);
