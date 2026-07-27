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
const body = await response.text();
const expectedChallenge = response.status === 401 && /bearer token required/i.test(body);

if (!expectedChallenge || !contentType.includes('application/json')) {
  throw new Error(
    `${remote.url} returned HTTP ${response.status} (${contentType || 'no content type'}): ${body.slice(0, 200)}`,
  );
}

console.log(`${remote.url} is reachable and requires a bearer token as expected.`);
