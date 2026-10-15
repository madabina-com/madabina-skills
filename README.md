# madabina-skills

Public Madabina Agent Skills and a TypeScript SDK for the merchant REST API and OAuth-protected MCP server.

## Install the skills

Install the npm package, then copy the skills into an agent directory:

```sh
npm install madabina-skills
npx madabina-skills install --agent codex
# or
npx madabina-skills install --agent claude --global
```

Supported agent targets: Codex (`.agents/skills`) and Claude Code (`.claude/skills`). Project scope is the default; `--global` installs under the current user's home directory. The command only writes the three Madabina skill directories.

## SDK: REST

```ts
import { MadabinaRestClient } from 'madabina-skills';

const api = new MadabinaRestClient({ baseUrl: 'https://madabina.com/api/v1' });
const { tokens, user } = await api.login({ email: process.env.MADABINA_EMAIL!, password: process.env.MADABINA_PASSWORD! });
api.setTokens(tokens);
const products = await api.listProducts({ search: 'phone' });
await api.logout();
```

The client refreshes once and retries a request after a 401 when it has a refresh token. It keeps tokens in memory only. Persist tokens securely in the consuming application; never commit or log them.

Available methods include authentication, profile, products, stock/visibility, orders (including `cancelOrder`), customers, and overview statistics. See each method's TypeScript signature and the installed `madabina-api` skill for endpoint details. The live OpenAPI document currently covers only part of the REST API.

## SDK: MCP

```ts
import { MadabinaMcpClient } from 'madabina-skills/mcp';
import type { OAuthClientProvider } from '@modelcontextprotocol/sdk/client/auth.js';

declare const authProvider: OAuthClientProvider; // Implement session-bound OAuth/PKCE storage in your host.
const mcp = new MadabinaMcpClient({ authProvider });
await mcp.connect();
try {
  const { tools } = await mcp.listTools();
  console.log(tools.map((tool) => tool.name));
} finally {
  await mcp.close();
}
```

The MCP SDK handles protocol OAuth discovery, PKCE, and token exchange through the provided OAuth client. Madabina's default endpoint is `https://mcp.madabina.com/mcp`. The host application owns token and verifier storage and the user-facing authorization redirect.

## Skills in this package

- `madabina-platform`: platform orientation, privacy, and choosing integrations.
- `madabina-api`: authenticated merchant REST API usage.
- `madabina-mcp`: OAuth MCP connection, scopes, and tool use.

Each skill is in `skills/<name>/SKILL.md` with supporting references. Import SDK modules from `madabina-skills`, `madabina-skills/rest`, or `madabina-skills/mcp`.

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
npm pack --dry-run
```

## Publishing to npm

Push commits to `main` to run package validation. The workflow skips versions already on npm and also skips publication while the package has never been bootstrapped. For the first release, publish the current version (`0.1.0`) once from a maintainer account with npm two-factor authentication, then configure **Trusted Publisher** in the package settings with GitHub Actions, repository `madabina-com/madabina-skills`, and workflow file `publish.yml`. Allow direct `npm publish` for that publisher.

For each later release, increment `version` in `package.json` and `package-lock.json`, then push to `main`. The workflow builds, validates, and publishes that new version using OIDC; no long-lived npm token is stored in GitHub.

## Security

Skills are instructions, not a substitute for API authorization. Use least-privilege OAuth scopes, verify selected stores and record IDs before writes, and require user approval before destructive actions. Do not put credentials in skill files or source control.

## License

MIT. See [LICENSE](LICENSE).
