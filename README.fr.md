# Serveur MCP de gestion de projet Stellary

Connectez vos assistants IA et agents de code aux projets Stellary avec le
Model Context Protocol (MCP). Le serveur hébergé donne accès aux projets,
tableaux, cartes, documents, missions et données de pilotage, dans la limite des
permissions du compte.

- **Endpoint :** `https://api.stellary.co/mcp`
- **Transport :** Streamable HTTP
- **Authentification :** OAuth 2.1 avec PKCE et rotation des refresh tokens ; les PAT Bearer restent disponibles pour la compatibilité

[Fiche du registre MCP officiel](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Anymfah%2Fstellary-project-management/versions/latest) ·
[Documentation complète](https://stellary.co/fr/docs/mcp/) ·
[English README](README.md)

## Connexion en trois étapes

1. Ajoutez l’endpoint hébergé dans un client MCP compatible OAuth.
2. Connectez-vous à Stellary dans la fenêtre de navigateur ouverte par le client.
3. Choisissez un workspace et autorisez **Moi**, un ou plusieurs agents actifs,
   ou les deux.

### Claude Code

```bash
claude mcp add stellary \
  --transport streamable-http \
  https://api.stellary.co/mcp
```

### Cursor et clients configurés en JSON

```json
{
  "mcpServers": {
    "stellary": {
      "url": "https://api.stellary.co/mcp"
    }
  }
}
```

Les clients qui ne prennent pas en charge OAuth distant peuvent encore utiliser
un PAT dédié depuis **Paramètres du compte → Tokens API** dans un header
`Authorization: Bearer`. Commencez avec des droits de lecture uniquement.

## Premier test conseillé

Demandez au client de lister vos projets Stellary. Ce test vérifie
l’authentification et les accès sans modifier de données. Demandez ensuite les
colonnes et les cartes d’un projet avant d’activer des droits d’écriture.

## Sécurité

- Révoquez une connexion OAuth depuis **Paramètres du workspace → Connexions MCP**
  lorsqu’un client ne doit plus avoir accès.
- Ne placez jamais un PAT réel dans Git ou dans un fichier partagé.
- Commencez avec des droits en lecture seule et une date d’expiration lorsqu’un
  PAT reste nécessaire.
- Les permissions Stellary et les limites de débit restent appliquées.
- Stellary ne transmet jamais au client les tokens propres de vos agents.

Pour signaler une vulnérabilité, suivez [SECURITY.md](SECURITY.md). Pour une
question de configuration, écrivez à
[support@stellary.co](mailto:support@stellary.co).

## Manifestes des annuaires d’agents

Ce dépôt est aussi la source publique de découverte pour les annuaires de
plugins. Les surfaces compatibles OAuth pointent vers le même endpoint
Streamable HTTP sans embarquer de secret. La configuration PAT reste documentée
pour les clients qui ne gèrent pas OAuth distant. Aucun n’utilise stdio/`npx`
local.

| Surface | Fichiers |
| --- | --- |
| cursor.directory / Open Plugins | [`.mcp.json`](.mcp.json) |
| Cursor Marketplace | [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json), [`mcp.json`](mcp.json) |
| Claude Code Plugin Directory | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), [`.mcp.json`](.mcp.json) |
| Gemini CLI Extensions | [`gemini-extension.json`](gemini-extension.json) |
| skills.sh / ClawHub | [`SKILL.md`](SKILL.md) (`npx skills add Anymfah/stellary-mcp`) |
| Grok Build | [`.grok-plugin/plugin.json`](.grok-plugin/plugin.json) |
| GitHub Copilot / Agent Plugins | [`plugin.json`](plugin.json) |
| OpenAI Plugins / Codex | [`plugins/stellary/.codex-plugin/plugin.json`](plugins/stellary/.codex-plugin/plugin.json), [`plugins/stellary/.mcp.json`](plugins/stellary/.mcp.json) |

Ne définissez `STELLARY_TOKEN` que pour un client sans OAuth. Ne commettez jamais
un token réel. Une icône 400×400 est dans
[`assets/logo-400.png`](assets/logo-400.png).

## À propos de ce dépôt

Ce dépôt public est la source officielle de découverte et de configuration du
serveur MCP hébergé de Stellary. Il contient la fiche du registre MCP, des
exemples de configuration, la documentation et les contrôles de disponibilité.
Le code de l’application Stellary et celui du serveur hébergé ne sont pas
distribués dans ce dépôt.
