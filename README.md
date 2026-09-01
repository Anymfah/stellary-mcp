# Stellary Project Management MCP Server

[![Validate MCP listing](https://github.com/Anymfah/stellary-mcp/actions/workflows/validate.yml/badge.svg)](https://github.com/Anymfah/stellary-mcp/actions/workflows/validate.yml)
[![MCP Registry](https://img.shields.io/badge/MCP-Official%20Registry-7c6cff)](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Anymfah%2Fstellary-project-management/versions/latest)
[![MCP Badge](https://lobehub.com/badge/mcp/anymfah-stellary-mcp)](https://lobehub.com/mcp/anymfah-stellary-mcp)
[![stellary-mcp MCP server](https://glama.ai/mcp/servers/Anymfah/stellary-mcp/badges/card.svg)](https://glama.ai/mcp/servers/Anymfah/stellary-mcp)
[![stellary-mcp MCP server](https://glama.ai/mcp/servers/Anymfah/stellary-mcp/badges/score.svg)](https://glama.ai/mcp/servers/Anymfah/stellary-mcp)

Connect AI assistants and coding agents to live Stellary projects through the
Model Context Protocol (MCP). The hosted server exposes project, board,
collaboration, cockpit, and agent-mission tools while preserving Stellary's
existing permissions.

- **Endpoint:** `https://api.stellary.co/mcp`
- **Transport:** Streamable HTTP
- **Authentication:** OAuth 2.1 with PKCE and refresh-token rotation; bearer PATs remain supported for compatibility

[Official MCP Registry listing](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Anymfah%2Fstellary-project-management/versions/latest) ·
[Documentation](https://stellary.co/docs/mcp/) ·
[Guide en français](README.fr.md)

## What you can do

- Discover projects, columns, cards, documents, and cockpit state.
- Create and update cards, move work, assign teammates, and add comments.
- Inspect sprints, priorities, agent status, and pending proposals.
- Run governed agent missions with workspace rules and approval policies.
- Use installed workspace integrations from eligible agent sessions.

An OAuth connection can authorize **Me**, one or more active workspace agents,
or both. The exact tool list is resolved at connection time and checked again
for the identity selected on every call. It depends on OAuth scopes, project
access, workspace configuration, and each agent's tool and autonomy policies.

## Connect in three steps

1. Add the hosted endpoint to an OAuth-capable MCP client.
2. Sign in to Stellary in the browser window opened by the client.
3. Choose a workspace and authorize **Me**, one or more active agents, or both.

### Claude Code

```bash
claude mcp add stellary \
  --transport streamable-http \
  https://api.stellary.co/mcp
```

### Cursor and JSON-based clients

```json
{
  "mcpServers": {
    "stellary": {
      "url": "https://api.stellary.co/mcp"
    }
  }
}
```

A reusable example is available in
[`examples/mcp-client.json`](examples/mcp-client.json).

Clients without remote OAuth support can still use a dedicated personal access
token from **Account settings → API tokens** as an `Authorization: Bearer`
header. Start with read-only scopes and add write scopes only when required.

## Recommended first request

Ask the client to list your Stellary projects. This confirms authentication and
project visibility without changing data. Then ask it to inspect one project's
columns and cards before enabling write scopes.

## Security

- Revoke an OAuth connection from **Workspace settings → MCP connections** when
  a client should no longer have access.
- Treat compatibility PATs like passwords and never commit one to a repository.
- Start with read-only scopes and use an expiry date when a PAT is required.
- All requests are still subject to Stellary permissions and rate limits.
- Stellary never sends the client the private tokens attached to your agents.

For a vulnerability, follow [SECURITY.md](SECURITY.md). For setup questions,
email [support@stellary.co](mailto:support@stellary.co).

## Agent directory manifests

This repository is also the public discovery source for agent plugin
directories. OAuth-capable surfaces point at the hosted Streamable HTTP endpoint
without embedding a secret. Legacy PAT configuration remains documented for
clients that cannot complete remote OAuth. None starts a local stdio/`npx`
server.

| Surface | Files |
| --- | --- |
| cursor.directory / Open Plugins | [`.mcp.json`](.mcp.json) |
| Cursor Marketplace | [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json), [`mcp.json`](mcp.json) |
| Claude Code Plugin Directory | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), [`.mcp.json`](.mcp.json) |
| Gemini CLI Extensions | [`gemini-extension.json`](gemini-extension.json) |
| skills.sh / ClawHub | [`SKILL.md`](SKILL.md) (`npx skills add Anymfah/stellary-mcp`) |
| Grok Build | [`.grok-plugin/plugin.json`](.grok-plugin/plugin.json) |
| GitHub Copilot / Agent Plugins | [`plugin.json`](plugin.json) |
| OpenAI Plugins / Codex | [`plugins/stellary/.codex-plugin/plugin.json`](plugins/stellary/.codex-plugin/plugin.json), [`plugins/stellary/.mcp.json`](plugins/stellary/.mcp.json) |

Only set `STELLARY_TOKEN` when a client cannot use OAuth. Never commit a real
token. A 400×400 listing icon is in
[`assets/logo-400.png`](assets/logo-400.png).

## About this repository

This public repository is the canonical discovery and configuration source for
Stellary's hosted MCP server. It contains the official MCP Registry manifest,
client examples, documentation, and automated availability checks. The hosted
Stellary application and server implementation are not distributed from this
repository.

Thin plugin manifests for Grok Build and GitHub Copilot live in
[`.mcp.json`](.mcp.json), [`.grok-plugin/plugin.json`](.grok-plugin/plugin.json),
and [`plugin.json`](plugin.json). They point at the hosted endpoint
`https://api.stellary.co/mcp` (Streamable HTTP with OAuth, plus PAT
compatibility). A 400×400 listing icon is in
[`assets/logo-400.png`](assets/logo-400.png).

The metadata and documentation in this repository are licensed under the MIT
License. Use of the hosted service is governed by the
[Stellary terms](https://stellary.co/terms/).
