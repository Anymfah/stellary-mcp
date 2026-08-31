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
- **Authentication:** Bearer personal access token (PAT)

[Official MCP Registry listing](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Anymfah%2Fstellary-project-management/versions/latest) ·
[Documentation](https://stellary.co/docs/mcp/) ·
[Guide en français](README.fr.md)

## What you can do

- Discover projects, columns, cards, documents, and cockpit state.
- Create and update cards, move work, assign teammates, and add comments.
- Inspect sprints, priorities, agent status, and pending proposals.
- Run governed agent missions with workspace rules and approval policies.
- Use installed workspace integrations from eligible agent sessions.

The exact tool list is resolved at connection time. It depends on the token's
scopes, the user's project access, the workspace configuration, and—when using
an agent identity—the agent's tool policy.

## Connect in three steps

1. Sign in to [Stellary](https://app.stellary.co), then open
   **Account settings → API tokens**.
2. Create a token. Read access starts with `projects:read` and
   `pilotage:read`; select write scopes only when the client needs them.
3. Add the hosted endpoint and the token to your MCP client.

### Claude Code

```bash
claude mcp add stellary \
  --transport streamable-http \
  https://api.stellary.co/mcp \
  --header "Authorization: Bearer YOUR_STELLARY_TOKEN"
```

### Cursor and JSON-based clients

```json
{
  "mcpServers": {
    "stellary": {
      "url": "https://api.stellary.co/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_STELLARY_TOKEN"
      }
    }
  }
}
```

A reusable example is available in
[`examples/mcp-client.json`](examples/mcp-client.json).

## Recommended first request

Ask the client to list your Stellary projects. This confirms authentication and
project visibility without changing data. Then ask it to inspect one project's
columns and cards before enabling write scopes.

## Security

- Treat Stellary tokens like passwords. Never commit a real token to a repository.
- Start with read-only scopes and use an expiry date.
- Use a dedicated token per MCP client so it can be revoked independently.
- All requests are still subject to Stellary permissions and rate limits.

For a vulnerability, follow [SECURITY.md](SECURITY.md). For setup questions,
email [support@stellary.co](mailto:support@stellary.co).

## Agent directory manifests

This repository is also the public discovery source for agent plugin
directories. Each file points at the same hosted Streamable HTTP endpoint and
Bearer PAT. None of them start a local stdio/`npx` server or use OAuth.

| Surface | Files |
| --- | --- |
| cursor.directory / Open Plugins | [`.mcp.json`](.mcp.json) |
| Cursor Marketplace | [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json), [`mcp.json`](mcp.json) |
| Claude Code Plugin Directory | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), [`.mcp.json`](.mcp.json) |
| Gemini CLI Extensions | [`gemini-extension.json`](gemini-extension.json) |
| skills.sh / ClawHub | [`SKILL.md`](SKILL.md) (`npx skills add Anymfah/stellary-mcp`) |
| Grok Build | [`.grok-plugin/plugin.json`](.grok-plugin/plugin.json) |
| GitHub Copilot / Agent Plugins | [`plugin.json`](plugin.json) |

Set `STELLARY_TOKEN` in the client environment or plugin settings. Never commit
a real token. A 400×400 listing icon is in
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
`https://api.stellary.co/mcp` (Streamable HTTP + Bearer PAT). A 400×400 listing
icon is in [`assets/logo-400.png`](assets/logo-400.png).

The metadata and documentation in this repository are licensed under the MIT
License. Use of the hosted service is governed by the
[Stellary terms](https://stellary.co/terms/).
