# Stellary — Cursor Marketplace submission

This file is the non-secret source of truth for
[cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) and
follow-up with `marketplace-publishing@cursor.com`. Reviewer credentials and
any other secrets must be entered only in their dedicated secure destinations.

The official plugin template also lists `kniparko@anysphere.com` as a Cursor
team contact for repository-link submissions.

## Listing

- **Plugin name:** `stellary`
- **Display name:** Stellary
- **Developer / author:** Stellary (`support@stellary.co`)
- **Repository:** `https://github.com/Anymfah/stellary-mcp`
- **Format:** Cursor Plugin (single-plugin repo; no `.cursor-plugin/marketplace.json`)
- **Manifest:** [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json)
- **MCP config:** [`mcp.json`](mcp.json) (explicitly pinned from the manifest)
- **Logo:** [`assets/logo-stellary.svg`](assets/logo-stellary.svg) (relative path)
- **Skill:** [`skills/stellary/SKILL.md`](skills/stellary/SKILL.md)
- **Category:** productivity
- **License:** MIT
- **Website:** `https://stellary.co/`
- **Documentation:** `https://stellary.co/docs/mcp/`
- **Privacy policy:** `https://stellary.co/privacy/`
- **Terms of service:** `https://stellary.co/terms/`
- **Support email:** `support@stellary.co`

### Short description

Connect Cursor to Stellary projects, boards, cockpit, and governed agent missions.

### What this package is

A Marketplace wrapper around the existing hosted Streamable HTTP MCP at
`https://api.stellary.co/mcp`. Cursor infers the remote HTTP transport from
`url`. The plugin does **not** ship a local server, `stdio` command, or `npx`
launcher.

### Authentication (do not invent secrets)

Cursor supports OAuth for remote Streamable HTTP MCP. This plugin uses that
path:

1. `mcp.json` contains only `type: "http"` and the hosted `url`.
2. No `Authorization` header and no `${STELLARY_TOKEN}` placeholder are
   shipped, so Cursor can complete OAuth instead of sending an empty Bearer.
3. Stellary publishes OAuth 2.1 discovery and dynamic client registration.
   Cursor should register itself; do not hardcode a client id or secret.

Stellary OAuth discovery (already live):

- Protected resource: `https://api.stellary.co/.well-known/oauth-protected-resource/mcp`
- Authorization server: `https://api.stellary.co/.well-known/oauth-authorization-server`
- Resource audience: `https://api.stellary.co/mcp`
- Public client: authorization code + PKCE S256 + DCR at `/register`

Cursor redirect URIs that Stellary must allow if users authenticate from both
surfaces (from [Cursor MCP docs](https://cursor.com/docs/mcp)):

- Desktop: `http://localhost:8787/callback`
- Web / Cursor Agents: `https://www.cursor.com/agents/mcp/oauth/callback`

A personal access token remains a **compatibility** option for user-owned
`~/.cursor/mcp.json` only. Start with `projects:read` and `pilotage:read`.
Never commit a real token. Never put `${STELLARY_TOKEN}` in the Marketplace
`mcp.json` while OAuth is the supported path.

## Publish-form checklist

Use this when filling [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
or emailing `marketplace-publishing@cursor.com`.

- [ ] Repository is public: `https://github.com/Anymfah/stellary-mcp`
- [ ] `.cursor-plugin/plugin.json` is at the repo root (Cursor Plugin format)
- [ ] `name` is unique, lowercase, kebab-case: `stellary`
- [ ] `description` states hosted Streamable HTTP MCP and OAuth
- [ ] `logo` is a committed relative path (`assets/logo-stellary.svg`)
- [ ] `mcpServers` is pinned to `./mcp.json` so a sibling `.mcp.json` cannot win
- [ ] `mcp.json` points at `https://api.stellary.co/mcp` with `type: "http"`
- [ ] `mcp.json` has no `command`, `npx`, `stdio`, headers, or secrets
- [ ] Every `${VAR}` in plugin config is declared under `variables` (none today)
- [ ] `README.md` documents Marketplace install and PAT fallback scopes
- [ ] `skills/stellary/SKILL.md` has `name` and `description` frontmatter
- [ ] `npm test` passes (registry, OpenAI package, Cursor package, endpoint)
- [ ] Plugin was smoke-tested locally from `~/.cursor/plugins/local/stellary`
- [ ] Stellary OAuth app allows the Cursor redirect URIs above
- [ ] Reviewer workspace credentials are entered only in the private review channel
- [ ] Submit the repo URL on the publish form, then follow up with this file if asked

## Local test before submit

```bash
ln -s /path/to/stellary-mcp ~/.cursor/plugins/local/stellary
```

Reload Cursor, open **Customize**, confirm the Stellary MCP server, complete
OAuth, then ask: “List my Stellary projects.”

## Reviewer setup

Create a dedicated reviewer workspace immediately before submission. Enter its
credentials only in the Cursor review channel.

- Use an email/password account with no MFA requirement for the reviewer.
- Give the account access only to the reviewer workspace.
- Seed one project with at least two columns, three cards, one document, and a
  visible blocker.
- Add one active external-MCP agent with a restrictive but usable tool policy.
- Queue one harmless test mission for that agent.
- Remove or rotate the reviewer account after the review is complete.

## Positive test cases

1. **Install and OAuth.** Install Stellary from the plugin package. Cursor opens
   Stellary consent. After authorize, tools appear without a PAT.
2. **Read projects.** Prompt: “Show my Stellary projects.” Expected: only
   projects visible to **Me** (or the selected identity); no writes.
3. **Inspect one project.** Prompt: “Review the seeded project's cards and
   blockers. Do not change anything.” Expected: columns/cards/blocker reported.
4. **List identities.** Prompt: “Which Stellary identities can I use?” Expected:
   opaque references for **Me** and any authorized agent; no private tokens.
5. **Optional write.** Prompt: create a card titled “Cursor reviewer check”.
   Expected: write as **Me** after the user asked for it.

## Negative test cases

1. **No local server.** The plugin must not spawn `npx`, Docker, or a stdio
   child process.
2. **No committed secret.** `mcp.json` and `plugin.json` contain no bearer
   token, client secret, or real PAT.
3. **Cross-workspace.** Projects from a workspace not selected at consent are
   not listed or mutated.

## Security and review notes

- This repository is discovery and plugin metadata only. The Stellary backend
  is not distributed here.
- OAuth access tokens expire after one hour. Refresh tokens rotate.
- Connections are revocable from **Workspace settings → MCP connections**.
- Marketplace plugins are open source and manually reviewed by Cursor.
- Report plugin security issues to `security-reports@cursor.com` and Stellary
  issues per [SECURITY.md](SECURITY.md).
