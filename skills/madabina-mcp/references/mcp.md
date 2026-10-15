# Madabina MCP reference

The public MCP resource is `https://mcp.madabina.com/mcp`. The Laravel OAuth issuer is `https://madabina.com`; authorization server metadata is exposed under `/.well-known/oauth-authorization-server`, and protected-resource metadata under `https://mcp.madabina.com/.well-known/oauth-protected-resource`.

Supported scopes:

| Scope | Intended access |
| --- | --- |
| `madabina.read` | Merchant/store context, products, orders, customers, statistics |
| `madabina.products.write` | Create and update products, stock, visibility |
| `madabina.orders.write` | Create orders and update order status, tracking, payment status |
| `madabina.destructive` | Delete products or cancel/delete orders |

The server checks OAuth scopes and merchant/store context. Some mutations require an idempotency key through the MCP tool contract. Discover tool input schemas at runtime with `tools/list` and use those schemas as the current contract.
