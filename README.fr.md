# Serveur MCP de gestion de projet Stellary

Connectez vos assistants IA et agents de code aux projets Stellary avec le
Model Context Protocol (MCP). Le serveur hébergé donne accès aux projets,
tableaux, cartes, documents, missions et données de pilotage, dans la limite des
permissions du compte.

- **Endpoint :** `https://api.stellary.co/mcp`
- **Transport :** Streamable HTTP
- **Authentification :** personal access token (PAT) dans un header Bearer

[Fiche du registre MCP officiel](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Anymfah%2Fstellary-project-management/versions/latest) ·
[Documentation complète](https://stellary.co/fr/docs/mcp/) ·
[English README](README.md)

## Connexion en trois étapes

1. Connectez-vous à [Stellary](https://app.stellary.co), puis ouvrez
   **Paramètres du compte → Tokens API**.
2. Créez un token. Commencez avec `projects:read` et `pilotage:read`, puis
   ajoutez uniquement les droits d’écriture nécessaires.
3. Ajoutez l’endpoint et le token à votre client MCP.

### Claude Code

```bash
claude mcp add stellary \
  --transport streamable-http \
  https://api.stellary.co/mcp \
  --header "Authorization: Bearer VOTRE_TOKEN_STELLARY"
```

### Cursor et clients configurés en JSON

```json
{
  "mcpServers": {
    "stellary": {
      "url": "https://api.stellary.co/mcp",
      "headers": {
        "Authorization": "Bearer VOTRE_TOKEN_STELLARY"
      }
    }
  }
}
```

## Premier test conseillé

Demandez au client de lister vos projets Stellary. Ce test vérifie
l’authentification et les accès sans modifier de données. Demandez ensuite les
colonnes et les cartes d’un projet avant d’activer des droits d’écriture.

## Sécurité

- Ne placez jamais un token réel dans Git ou dans un fichier partagé.
- Commencez avec des droits en lecture seule et une date d’expiration.
- Créez un token par client pour pouvoir le révoquer séparément.
- Les permissions Stellary et les limites de débit restent appliquées.

Pour signaler une vulnérabilité, suivez [SECURITY.md](SECURITY.md). Pour une
question de configuration, écrivez à
[support@stellary.co](mailto:support@stellary.co).

## Manifestes des annuaires d’agents

Ce dépôt est aussi la source publique de découverte pour les annuaires de
plugins. Chaque fichier pointe vers le même endpoint Streamable HTTP hébergé
et un PAT Bearer. Aucun n’utilise stdio/`npx` local ni OAuth.

| Surface | Fichiers |
| --- | --- |
| cursor.directory / Open Plugins | [`.mcp.json`](.mcp.json) |
| Cursor Marketplace | [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json), [`mcp.json`](mcp.json) |
| Claude Code Plugin Directory | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), [`.mcp.json`](.mcp.json) |
| Gemini CLI Extensions | [`gemini-extension.json`](gemini-extension.json) |
| skills.sh / ClawHub | [`SKILL.md`](SKILL.md) (`npx skills add Anymfah/stellary-mcp`) |
| Grok Build | [`.grok-plugin/plugin.json`](.grok-plugin/plugin.json) |
| GitHub Copilot / Agent Plugins | [`plugin.json`](plugin.json) |

Définissez `STELLARY_TOKEN` dans l’environnement du client. Ne commettez jamais
un token réel. Une icône 400×400 est dans
[`assets/logo-400.png`](assets/logo-400.png).

## À propos de ce dépôt

Ce dépôt public est la source officielle de découverte et de configuration du
serveur MCP hébergé de Stellary. Il contient la fiche du registre MCP, des
exemples de configuration, la documentation et les contrôles de disponibilité.
Le code de l’application Stellary et celui du serveur hébergé ne sont pas
distribués dans ce dépôt.
