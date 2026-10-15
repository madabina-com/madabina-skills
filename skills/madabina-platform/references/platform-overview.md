# Platform overview

Madabina provides merchant storefront and back-office workflows, including product catalogues, orders, customers, and sales statistics. Availability and permissions depend on the merchant's account and selected store.

Use the authenticated REST API at `https://madabina.com/api/v1` for direct application integrations. Use the MCP server at `https://mcp.madabina.com/mcp` when an AI client needs discoverable tools and resources with merchant authorization. These are separate authentication surfaces: REST uses merchant login and bearer tokens; MCP uses OAuth authorization.

The public REST OpenAPI document is `https://madabina.com/api/openapi.json`. Its current coverage is incomplete; confirm endpoint behavior against the API guide before relying on a schema generated from it.

Never assume a merchant's production credentials or demo accounts. Ask the merchant to configure their own account through a secure UI.
