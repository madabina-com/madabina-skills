# Choosing an integration

| Need | Integration |
| --- | --- |
| Build a merchant-owned app or service | REST API and `MadabinaRestClient` |
| Let an AI assistant discover and call Madabina tools | OAuth-protected MCP endpoint and `MadabinaMcpClient` |
| Guide a merchant through a manual dashboard task | Platform instructions; do not request their password |

REST base URL: `https://madabina.com/api/v1`.

MCP endpoint: `https://mcp.madabina.com/mcp`.

Use the least privilege needed. MCP read-only work needs `madabina.read`; product changes need `madabina.products.write`; order changes need `madabina.orders.write`; destructive operations require `madabina.destructive`. OAuth consent and server-side authorization remain authoritative.
