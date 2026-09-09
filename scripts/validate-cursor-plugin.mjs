import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hostedUrl = 'https://api.stellary.co/mcp';
const pluginNamePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const manifestPath = path.join(root, '.cursor-plugin', 'plugin.json');
const mcpPath = path.join(root, 'mcp.json');
const skillPath = path.join(root, 'skills', 'stellary', 'SKILL.md');
const readmePath = path.join(root, 'README.md');

assert(fs.existsSync(manifestPath), 'Missing .cursor-plugin/plugin.json');
assert(fs.existsSync(mcpPath), 'Missing mcp.json');
assert(!fs.existsSync(path.join(root, '.cursor-plugin', 'marketplace.json')),
  'Single-plugin repos must not ship .cursor-plugin/marketplace.json.');

const manifest = readJson(manifestPath);
const mcp = readJson(mcpPath);
const server = mcp.mcpServers?.stellary;

assert(typeof manifest.name === 'string' && pluginNamePattern.test(manifest.name),
  'plugin.json name must be lowercase kebab-case.');
assert(manifest.name === 'stellary', 'The Cursor plugin name must be stellary.');
assert(manifest.displayName === 'Stellary', 'displayName must be Stellary.');
assert(manifest.version === '0.13.0', 'The Cursor plugin must use release version 0.13.0.');
assert(typeof manifest.description === 'string' && manifest.description.includes(hostedUrl),
  'description must mention the hosted MCP URL.');
assert(/oauth/i.test(manifest.description), 'description must mention OAuth.');
assert(manifest.author?.name === 'Stellary', 'author.name must be Stellary.');
assert(manifest.license === 'MIT', 'license must be MIT.');
assert(manifest.homepage === 'https://stellary.co/docs/mcp/', 'homepage must be the MCP docs.');
assert(manifest.repository === 'https://github.com/Anymfah/stellary-mcp',
  'repository must be the public GitHub URL.');
assert(manifest.mcpServers === './mcp.json',
  'mcpServers must pin ./mcp.json so a sibling .mcp.json cannot be selected.');
assert(manifest.logo === 'assets/logo-stellary.svg',
  'logo must be the committed relative SVG path.');
assert(!path.isAbsolute(manifest.logo) && !manifest.logo.includes('..'),
  'logo must be a safe relative path.');
assert(fs.existsSync(path.join(root, manifest.logo)), 'logo file is missing.');
assert(!manifest.variables,
  'Do not declare STELLARY_TOKEN variables while the Marketplace package uses OAuth.');

assert(server?.type === 'http', 'mcp.json must declare type http (Cursor remote / Streamable HTTP).');
assert(server?.url === hostedUrl, 'mcp.json must use the canonical Stellary MCP URL.');
assert(!server.command && !server.args, 'mcp.json must not start a local command.');
assert(!server.env && !server.envFile, 'mcp.json must not pass process env into a local server.');
assert(!server.headers, 'OAuth package must not embed an Authorization header or PAT placeholder.');
assert(!server.auth?.CLIENT_SECRET, 'Do not ship an OAuth client secret.');
assert(!JSON.stringify(mcp).includes('npx'), 'mcp.json must not use npx.');
assert(!JSON.stringify(mcp).includes('stdio'), 'mcp.json must not use stdio.');

const mcpText = fs.readFileSync(mcpPath, 'utf8');
const manifestText = fs.readFileSync(manifestPath, 'utf8');
for (const [label, text] of [
  ['mcp.json', mcpText],
  ['.cursor-plugin/plugin.json', manifestText],
]) {
  assert(!/\$\{env:STELLARY_TOKEN\}/.test(text), `${label} must not use shell env interpolation.`);
  assert(!/\$\{STELLARY_TOKEN\}/.test(text), `${label} must not embed a STELLARY_TOKEN placeholder.`);
  assert(!/Bearer\s+[A-Za-z0-9._-]{12,}/.test(text), `${label} must not contain a hardcoded bearer token.`);
}

const skill = fs.readFileSync(skillPath, 'utf8');
assert(skill.startsWith('---\n'), 'skills/stellary/SKILL.md must start with YAML frontmatter.');
assert(/^name:\s+stellary$/m.test(skill), 'Cursor skill name must be stellary.');
assert(/^description:\s+\S+/m.test(skill), 'Cursor skill must have a description.');
assert(skill.includes(hostedUrl), 'Cursor skill must mention the hosted endpoint.');
assert(/OAuth/i.test(skill), 'Cursor skill must mention OAuth.');
assert(/projects:read/.test(skill) && /pilotage:read/.test(skill),
  'Cursor skill must document the starting PAT scopes for compatibility.');

const readme = fs.readFileSync(readmePath, 'utf8');
assert(/Cursor Marketplace/i.test(readme), 'README.md must document Cursor Marketplace install.');
assert(readme.includes('projects:read') && readme.includes('pilotage:read'),
  'README.md must document starting PAT scopes projects:read and pilotage:read.');
assert(readme.includes(hostedUrl), 'README.md must keep the hosted endpoint.');
assert(!/npx\s+-y/.test(readme), 'README.md must not recommend an npx stdio server.');

assert(fs.existsSync(path.join(root, 'CURSOR_SUBMISSION.md')),
  'CURSOR_SUBMISSION.md is required for the publish form.');

console.log('Cursor Marketplace plugin package is structurally valid.');
