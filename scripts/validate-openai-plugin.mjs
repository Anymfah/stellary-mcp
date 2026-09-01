import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = path.join(root, 'plugins', 'stellary');
const manifestPath = path.join(pluginRoot, '.codex-plugin', 'plugin.json');
const mcpPath = path.join(pluginRoot, '.mcp.json');
const logoPath = path.join(pluginRoot, 'assets', 'logo-400.png');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const manifest = readJson(manifestPath);
const mcp = readJson(mcpPath);
const server = mcp.mcpServers?.stellary;
const releaseManifests = [
  'package.json',
  'server.json',
  'plugin.json',
  'gemini-extension.json',
  '.claude-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.grok-plugin/plugin.json',
].map((file) => [file, readJson(path.join(root, file))]);

assert(path.basename(pluginRoot) === manifest.name, 'The plugin folder and manifest name must match.');
assert(manifest.version === '0.13.0', 'The OpenAI plugin must use release version 0.13.0.');
assert(manifest.mcpServers === './.mcp.json', 'The manifest must reference its packaged MCP configuration.');
assert(server?.type === 'http', 'Stellary must use the remote HTTP MCP transport.');
assert(server?.url === 'https://api.stellary.co/mcp', 'The plugin must use the canonical Stellary MCP URL.');
assert(!server.headers, 'The OAuth package must not embed an Authorization header or PAT placeholder.');

for (const [file, releaseManifest] of releaseManifests) {
  assert(releaseManifest.version === '0.13.0', `${file} must use release version 0.13.0.`);
}

const oauthConfigs = [
  ['.mcp.json', readJson(path.join(root, '.mcp.json')).mcpServers?.stellary],
  ['mcp.json', readJson(path.join(root, 'mcp.json')).mcpServers?.stellary],
  ['gemini-extension.json', readJson(path.join(root, 'gemini-extension.json')).mcpServers?.stellary],
];
for (const [file, config] of oauthConfigs) {
  assert(config?.url === 'https://api.stellary.co/mcp' || config?.httpUrl === 'https://api.stellary.co/mcp', `${file} must use the canonical MCP URL.`);
  assert(!config.headers, `${file} must not require a PAT or embed an Authorization header.`);
}

for (const key of [
  'displayName',
  'shortDescription',
  'longDescription',
  'developerName',
  'category',
  'websiteURL',
  'privacyPolicyURL',
  'termsOfServiceURL',
  'brandColor',
  'composerIcon',
  'logo',
]) {
  assert(manifest.interface?.[key], `Missing interface.${key}.`);
}

assert(Array.isArray(manifest.interface.defaultPrompt), 'interface.defaultPrompt must be an array.');
assert(manifest.interface.defaultPrompt.length === 3, 'The plugin must include exactly three starter prompts.');
assert(manifest.interface.defaultPrompt.every((prompt) => prompt.length <= 128), 'Starter prompts must be concise.');

const png = fs.readFileSync(logoPath);
assert(png.toString('hex', 1, 4) === '504e47', 'The listing logo must be a PNG.');
assert(png.readUInt32BE(16) === 400 && png.readUInt32BE(20) === 400, 'The listing logo must be 400×400.');

for (const assetKey of ['composerIcon', 'logo']) {
  const assetPath = path.resolve(pluginRoot, manifest.interface[assetKey]);
  assert(assetPath.startsWith(`${pluginRoot}${path.sep}`), `interface.${assetKey} must stay inside the plugin package.`);
  assert(fs.existsSync(assetPath), `interface.${assetKey} points to a missing file.`);
}

assert(fs.existsSync(path.join(root, 'OPENAI_SUBMISSION.md')), 'OPENAI_SUBMISSION.md is required.');

console.log('OpenAI plugin package is structurally valid.');
