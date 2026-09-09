---
name: stellary
description: Use Stellary project management through the hosted Streamable HTTP MCP. Discover projects, boards, cards, documents, cockpit state, and governed agent missions. Use when the user mentions Stellary, boards, cockpit/pilotage, or agent missions.
---

# Stellary hosted MCP

Stellary is an AI-native project piloting SaaS. This plugin wraps the **hosted**
Model Context Protocol server. It does not start a local `stdio` or `npx` process.

- Endpoint: `https://api.stellary.co/mcp`
- Transport: Streamable HTTP
- Auth: Cursor OAuth 2.1 (PKCE and dynamic client registration). A personal
  access token is only a compatibility fallback outside this plugin package.
- Docs: https://stellary.co/docs/mcp/

If Stellary MCP tools are already available, use them. Do not invent a local
server, wrapper package, or hardcoded token.

## Connect when tools are missing

1. Prefer the Cursor Marketplace listing for **Stellary**, then complete the
   browser OAuth consent. Choose a workspace and authorize **Me**, one or more
   active agents, or both.
2. If Marketplace install is unavailable, add only the hosted URL to Cursor MCP
   settings. Cursor discovers OAuth from Stellary metadata. Do not add a Bearer
   header when OAuth can complete.
3. If several identities were authorized, call `stellary_list_identities` and
   pass the selected opaque reference in `actingAs`. Never invent or persist an
   identity reference beyond the connection that returned it.

A compatibility PAT belongs in the user's own MCP settings, never in this
repository. When a PAT is required, start with `projects:read` and
`pilotage:read`, then add write scopes only if the user asked for writes.

## First request

Call `list_projects` before any write. That confirms authentication and project
visibility without changing data.

## Safe operating rules

- Prefer exact IDs after discovery. Name-based helpers can fuzzy-match the wrong resource.
- Read first: `list_projects` → one project → columns/cards/documents → then write.
- Do not bulk-create, reassign, or complete missions unless the user asked for that change.
- Revoke OAuth from **Workspace settings → MCP connections** when access should end.
- All calls still obey Stellary permissions, autonomy policy, and rate limits.
