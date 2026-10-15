# Project Workflow Reference

Use this reference to locate sources of truth and select checks for changes in the `madabina-skills` npm package. Re-read the current files before acting; this map is for navigation, not a substitute for the implementation.

## Repository map

| Area | Primary files | Contract or behavior source |
| --- | --- | --- |
| Public Madabina skills | `skills/madabina-platform/`, `skills/madabina-brand/`, `skills/madabina-api/`, `skills/madabina-mcp/` | Their `SKILL.md` files and adjacent `references/` |
| REST TypeScript SDK | `src/rest.ts`, `test/rest.test.ts` | `../web-app/routes/api.php`, related controllers and request validation; OpenAPI is partial |
| MCP TypeScript SDK | `src/mcp.ts`, `test/mcp.test.ts` | `../mcp/src/tools/contracts.ts`, `../mcp/src/http/oauth.ts`, and MCP server implementation |
| Skills installer and updates | `src/cli.ts`, `src/installer.ts`, `src/update.ts`, `test/installer.test.ts`, `test/update.test.ts` | The copied public skill directories and supported `codex`, `claude`, and Chriki/Pi targets; Codex and Chriki use Agent Skills `.agents/skills` locations. npm latest-version lookup runs only when the CLI is invoked and falls back to bundled skills offline |
| Package contents and exports | `package.json`, `package-lock.json` | `files`, `exports`, `bin`, scripts, and the built `dist/` output |
| CI and npm release | `.github/workflows/publish.yml` | GitHub Actions workflow and npm Trusted Publisher configuration |

## Change workflow

1. Identify the requested behavior and inspect the repository status. Keep the change scoped and preserve unrelated modifications.
2. Trace the relevant source-of-truth contract before editing SDK methods or skill references. For REST, verify route, payload, response, auth, and validation behavior in `../web-app`. For MCP, verify tool names, input schemas, mutating behavior, required scopes, OAuth metadata, and transport in `../mcp`.
3. Update the implementation, affected tests, and user-facing documentation together. Keep merchant-facing skills under `skills/`; keep maintainer instructions under `.agents/skills/`.
4. Select checks based on the touched area. For package-wide or release-bound changes, run the full validation sequence below.
5. Review `git diff` and `git status` to ensure only intended files changed. Do not commit or push without an explicit request.

## Validation

Run from the package root when dependencies are available:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm pack --dry-run
```

Use focused tests for a narrow implementation change, but run typecheck, the full test suite, build, and pack dry-run before a package release. Confirm the pack listing contains the intended public `skills/`, `dist/`, README, and license files and excludes `.agents/` and maintainer-only resources.

## Release and publication

- Read the current `package.json`, `package-lock.json`, and `.github/workflows/publish.yml`; do not assume the version, workflow conditions, or npm publisher configuration is unchanged.
- A release requires an explicit user request. Increment the package version consistently in `package.json` and `package-lock.json`, then complete the release validation above before any requested commit or push.
- A push to `main` runs validation. The publish job uses the GitHub Actions OIDC identity through npm Trusted Publishing and publishes only a version that is not already present on npm. The workflow currently skips publication when the package itself is absent, for initial bootstrap.
- Never add an npm access token as a repository file, workflow variable, or long-lived GitHub secret. Do not weaken OIDC or bypass a failed validation job to publish.
- After an explicitly requested release push, inspect the corresponding GitHub Actions run and query the npm registry for the exact package version. A push or successful build alone does not prove publication.
- If trusted publishing, package permissions, or registry state blocks release, report the observed blocker and stop before trying a different credential or publishing path.
