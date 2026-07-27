# Security policy

## Report a vulnerability

Please report security issues privately to
[security@stellary.co](mailto:security@stellary.co). Include the affected MCP
method or tool, the impact, and reproducible steps when possible.

Do not open a public GitHub issue for a suspected vulnerability and do not
include access tokens, personal data, or customer workspace data in a report.

We will acknowledge a valid report and coordinate remediation and disclosure
directly with the reporter.

## Credential safety

The Stellary MCP endpoint requires a bearer token. Never commit a real token to
this repository. If a token is exposed, revoke it immediately in Stellary account
settings and create a replacement with the minimum required scopes.
