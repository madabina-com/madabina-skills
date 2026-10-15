# madabina-skills

![Madabina logo](https://cdn.madabina.com/static/madabina/logo/logo-madabina.svg)

Public Madabina Agent Skills and a TypeScript SDK for the merchant REST API and OAuth-protected MCP server.

Learn more about [Madabina](http://madabina.com).

## Install the skills

### Option 1: Skills CLI

```sh
npx skills add madabina-com/madabina-skills --all --yes
```

The Skills CLI installs these skills from the public GitHub repository into the agent environment you choose.

### Option 2: npm

Install the package from npm, then copy the skills into an agent directory:

```sh
npm install madabina-skills
npx madabina-skills install --agent codex
```

Both `install` and `update` check npm's lightweight `latest` metadata when run. If a newer package exists, the CLI runs that version and copies its skills; otherwise it copies the bundled skills. If npm is unreachable, it falls back to the bundled version. This check runs only when the CLI is invoked, never in the agent's response workflow.

Run `update` to refresh an existing project or global installation:

```sh
npx madabina-skills update --agent codex
npx madabina-skills update --agent claude --global
npx madabina-skills update --agent chriki
npx madabina-skills update --agent chriki --global
```

Supported targets are Codex (`.agents/skills`), Chriki/Pi (`.agents/skills` for projects and `~/.agents/skills` globally), and Claude Code (`.claude/skills`). Skills installed through the separate Skills CLI can be refreshed by running `npx skills add madabina-com/madabina-skills --all --yes` again.

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
- `madabina-brand`: verified visual identity references for Madabina-branded design.
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

## Security

Skills are instructions, not a substitute for API authorization. Use least-privilege OAuth scopes, verify selected stores and record IDs before writes, and require user approval before destructive actions. Do not put credentials in skill files or source control.

## License

MIT. See [LICENSE](LICENSE).
