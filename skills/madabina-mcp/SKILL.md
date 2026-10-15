---
name: madabina-mcp
description: Connect an AI application to Madabina through the OAuth-protected Streamable HTTP MCP server and use its merchant tools with least privilege.
license: MIT
metadata:
  author: Madabina
  version: "0.1.0"
---

# Madabina MCP

Use this skill when an MCP-compatible client needs access to Madabina merchant tools or resources.

## Connection

- Server URL: `https://mcp.madabina.com/mcp` (Streamable HTTP).
- OAuth issuer: `https://madabina.com`; discover authorization metadata and follow the server's OAuth/PKCE flow through the official MCP TypeScript SDK.
- Request only scopes needed: `madabina.read`, `madabina.products.write`, `madabina.orders.write`, and, only when needed, `madabina.destructive`.
- Use `MadabinaMcpClient` with an application-owned `OAuthClientProvider`. That provider is responsible for session-bound storage of client registration, tokens, and PKCE verifier. Never share this state across users.
- Handle the SDK's authorization-required result by opening the URL through the host app's approved browser flow, then pass the returned authorization code to `finishAuth` and reconnect.

## Tool use

- Discover available tools with `listTools()`; do not assume the connected server version exposes every operation.
- Read merchant context and the selected store before querying or mutating records.
- Use read tools to verify target UUIDs and current values before changes. Explain the action and ask for approval before destructive operations.
- MCP write requests may require idempotency and are scoped to the authorized merchant/store. Let the server enforce authorization; never work around scope errors by switching to another identity or endpoint.
- Treat tool results as private business data. Return only fields necessary for the user's request.

## Example

```ts
import { MadabinaMcpClient } from 'madabina-skills/mcp';

const client = new MadabinaMcpClient({ authProvider }); // Implement OAuthClientProvider in the host application.
await client.connect();
try {
  const { tools } = await client.listTools();
  console.log(tools.map(({ name }) => name));
} finally {
  await client.close();
}
```

## References

- [MCP OAuth and tools](references/mcp.md)
