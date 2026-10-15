---
name: madabina-api
description: Integrate with Madabina's merchant REST API using the typed TypeScript SDK or HTTP, including authentication, products, orders, customers, and statistics.
license: MIT
metadata:
  author: Madabina
  version: "0.1.0"
---

# Madabina REST API

Use for merchant-owned application integrations against `https://madabina.com/api/v1`.

## Authentication

- Login with `POST /auth/login` using the merchant's email and password in a secure application flow. Successful responses contain an access token, refresh token, and user profile in `data`.
- Send the access token as `Authorization: Bearer <accessToken>`.
- Refresh through `POST /auth/refresh` with `{ "refreshToken": "..." }`; replace both tokens with the returned pair.
- Logout through `POST /auth/logout` with the refresh token, then clear local credentials.
- Keep credentials in a secure, application-owned store. This skill and the SDK do not persist tokens.

## API usage

- Use `MadabinaRestClient` from `madabina-skills` for typed requests, or follow the endpoint guide in [REST reference](references/rest-api.md).
- Handle non-2xx responses as errors. Validation errors may include field details; a 401 means authentication failed or expired, not that the resource is empty.
- Respect pagination and filters returned by each list endpoint. Avoid repeatedly downloading customer or order data when a narrower query will do.
- Check the selected merchant/store and record UUID before any mutation. Confirm with the user before deleting a product or order.
- Product and order request payloads are validated by the server. Consult the API docs and current validation rules; the published OpenAPI schema is only partial.

## Examples

```ts
import { MadabinaRestClient } from 'madabina-skills';

const api = new MadabinaRestClient();
const { tokens } = await api.login({ email: process.env.MADABINA_EMAIL!, password: process.env.MADABINA_PASSWORD! });
try {
  const products = await api.listProducts({ search: 'phone', isVisible: true });
  console.log(products.items.length);
} finally {
  api.setTokens(tokens);
  await api.logout();
}
```

Do not print tokens or customer personal data to logs. In production, load credentials from a secret manager and avoid logging full API responses.

## References

- [REST endpoint guide](references/rest-api.md)
