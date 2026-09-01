# Stellary — OpenAI Plugins Directory submission

This file is the non-secret source of truth for the OpenAI submission form. Reviewer credentials, domain-verification tokens, and any other secrets must be entered only in their dedicated secure destinations.

## Listing

- **Plugin name:** Stellary
- **Developer name:** Stellary
- **MCP server URL:** `https://api.stellary.co/mcp`
- **Category:** Productivity
- **Website:** `https://stellary.co/`
- **Documentation and support:** `https://stellary.co/docs/mcp/`
- **Support email:** `support@stellary.co`
- **Privacy policy:** `https://stellary.co/privacy/`
- **Terms of service:** `https://stellary.co/terms/`
- **Logo:** `plugins/stellary/assets/logo-400.png` (400×400 PNG)
- **Custom UI:** None. Stellary is an MCP-only plugin, so no screenshots are supplied.
- **Availability:** Worldwide where ChatGPT Plugins and the Stellary service are available.

### Short description

Run Stellary projects and governed agent missions.

### Long description

Connect ChatGPT and Codex to your Stellary workspace. Inspect or update projects, boards, cards, documents, and cockpit state, then run governed missions as yourself or as one of the active agents you authorize. Every action remains subject to the connection scopes, project permissions, agent policy, autonomy settings, and mission snapshot. Stellary never shares an agent's private token with the client.

### Starter prompts

1. Show my Stellary projects and current priorities.
2. Review the selected project's cards and blockers.
3. Check which Stellary identities I can act as.

### Release notes

Initial OpenAI directory release. Adds OAuth 2.1 with PKCE, dynamic client registration, refresh-token rotation, workspace consent, multi-identity authorization for **Me** and active agents, per-call `actingAs` checks, revocation, and standard MCP tool annotations. Existing PAT and JWT connections remain supported.

## Reviewer setup

Create a dedicated reviewer workspace immediately before submission. Enter its credentials only in the OpenAI portal.

- Use an email/password account with no MFA requirement for the reviewer.
- Give the account access only to the reviewer workspace.
- Seed one project with at least two columns, three cards, one document, and a visible blocker.
- Add one active external-MCP agent with a restrictive but usable tool policy.
- Queue one harmless test mission for that agent.
- Remove or rotate the reviewer account after the review is complete.

## Positive test cases

### 1. Read projects as the human identity

**Prompt:** Show my Stellary projects and current priorities.

**Expected:** The plugin lists only projects visible to **Me**, identifies the seeded project, and summarizes current priorities without modifying data.

### 2. Inspect one project's work

**Prompt:** Review the seeded project's cards and tell me which items are blocked. Do not change anything.

**Expected:** The plugin reads project details, columns, cards, and relevant comments or documents. It reports the seeded blocker and performs no write.

### 3. List authorized identities

**Prompt:** Which Stellary identities can I use through this connection?

**Expected:** `stellary_list_identities` returns opaque references for **Me** and the authorized reviewer agent, with display information but no access token or unrelated private data.

### 4. Perform an explicit human write

**Prompt:** In the seeded project, create a card titled “OpenAI reviewer check” in the review column with the description “Created during plugin review”.

**Expected:** The plugin resolves exact project and column identifiers, executes the write as **Me**, confirms the created card, and can read it back.

### 5. Run a governed agent mission

**Prompt:** Use the authorized reviewer agent to claim its queued mission, inspect the mission context, and resolve it when complete.

**Expected:** The plugin selects the agent through `actingAs`, initializes the session, claims only the seeded mission, includes the valid `missionRunId` on mission-bound actions, obeys the immutable mission snapshot and tool policy, then records the resolution in Stellary.

## Negative test cases

### 1. Cross-workspace access

**Prompt:** List projects from another Stellary workspace that was not selected during consent.

**Expected:** Access is denied or no such projects are returned. The plugin never changes workspace based only on the prompt.

### 2. Ambiguous multi-identity write

**Prompt:** Create a card without choosing whether to act as me or the authorized agent.

**Expected:** When several identities are authorized, the server requires `actingAs`; the plugin asks the user to choose an available identity instead of guessing.

### 3. Unavailable or unauthorized agent

**Prompt:** Act as an agent that is suspended, disabled, or not included in this OAuth connection.

**Expected:** The identity is refused at call time. Other authorized identities remain usable and no agent credential is disclosed.

## Security and review notes

- OAuth discovery is published at `/.well-known/oauth-protected-resource/mcp` and `/.well-known/oauth-authorization-server`.
- The public client flow uses authorization code, PKCE S256, and dynamic client registration.
- The resource audience is strictly `https://api.stellary.co/mcp`.
- Access tokens expire after one hour. Refresh tokens rotate and are revoked as a family if reuse is detected.
- Connections and effective identities are auditable and revocable from Stellary workspace settings.
- Read/write annotations are generated from the canonical tool registry, and backend tests fail if a public MCP tool lacks standard annotations.
- Tool output is limited by the authorized workspace, scopes, Stellary permissions, agent policy, and mission context.

## Final portal checklist

- [ ] Submit from a global OpenAI Platform project, not an EU data-residency project.
- [ ] Confirm the submitting account has `api.apps.read` and `api.apps.write`.
- [ ] Complete individual or business verification; use business verification to publish as Stellary.
- [ ] Install the portal's domain challenge token at `https://api.stellary.co/.well-known/openai-apps-challenge`.
- [ ] Enter fresh reviewer credentials in the portal without committing them.
- [ ] Run all five positive and three negative tests in ChatGPT Developer Mode.
- [ ] Submit the review form, then publish the approved release in the portal.
