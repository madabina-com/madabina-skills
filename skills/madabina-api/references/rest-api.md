# REST endpoint guide

Base URL: `https://madabina.com/api/v1`. Send `Accept: application/json`; send JSON content type for JSON bodies.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout` |
| Products | `GET/POST /products`, `GET/PUT/DELETE /products/{uuid}`, `PATCH /products/{uuid}/stock`, `PATCH /products/{uuid}/visibility` |
| Orders | `GET/POST /orders`, `GET/DELETE /orders/{uuid}`, `PATCH /orders/{uuid}/status`, `/tracking`, `/payment-status` |
| Customers | `GET /customers`, `GET /customers/{uuid}` |
| Statistics | `GET /stats/overview` |

List endpoints accept query filters such as `search`, `status`, `dateFrom`, and `dateTo` where supported. The exact filter set and payload rules vary by endpoint.

Success responses commonly use `{ "success": true, "data": ..., "meta": ... }`. Failures commonly use `{ "success": false, "message": ..., "statusCode": ..., "details": ... }`. A 204 response has no body.

Interactive docs: `https://madabina.com/api/docs`. OpenAPI: `https://madabina.com/api/openapi.json`. OpenAPI currently describes only a subset of the operations above; rely on the route guide and server validation when details are absent.
