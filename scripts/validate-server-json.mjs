import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'server.json'), 'utf8'));
const response = await fetch('https://registry.modelcontextprotocol.io/v0.1/validate', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(manifest),
});

if (!response.ok) {
  throw new Error(`Registry validation request failed with HTTP ${response.status}: ${await response.text()}`);
}

const result = await response.json();
if (!result.valid) {
  const issues = (result.issues ?? [])
    .map((issue) => `${issue.severity}: ${issue.path} — ${issue.message}`)
    .join('\n');
  throw new Error(`The MCP Registry rejected server.json:\n${issues}`);
}

console.log('server.json is valid for the official MCP Registry.');
