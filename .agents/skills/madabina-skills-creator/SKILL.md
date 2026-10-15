---
name: madabina-skills-creator
description: Use when developing, maintaining, documenting, validating, or releasing the Madabina skills npm package, its public Agent Skills, REST or MCP TypeScript clients, installer, or publishing workflow.
metadata:
  internal: true
---

# Madabina Skills Project Maintainer

Use this skill for work in the `madabina-skills` repository. Read [the project workflow](references/project-workflow.md), then load only the sections relevant to the requested change.

## Working approach

- Inspect the current Git state, package metadata, and affected source before editing. Preserve unrelated user changes and do not infer that a dirty change belongs to this task.
- Keep the four public skills in `skills/`. This maintainer skill belongs under `.agents/skills/`; do not add it to the npm package or the public skills installer.
- Verify REST and MCP contracts against the sibling Madabina service sources when changing integrations. The published REST OpenAPI document is incomplete; do not invent routes, payloads, scopes, or capabilities.
- Keep credentials, OAuth state, tokens, and publisher secrets out of source, examples, logs, and committed files. Use npm Trusted Publishing/OIDC as configured; do not add a long-lived npm token.
- Run the checks relevant to the change and report their actual results. For package-wide changes, use the complete validation sequence in the workflow reference.
- Do not commit, push, publish, or create a release unless the user explicitly requests that action. If requested, finish local validation first and verify the resulting GitHub Actions and npm state before claiming success.

## Task routing

- Public skill content or references: inspect the affected `skills/<name>/` files and keep instructions aligned with the current API or MCP contract.
- REST SDK: inspect `src/rest.ts` and `test/rest.test.ts`, then verify endpoints and validation against `../web-app/routes/api.php` and the relevant controllers.
- MCP SDK: inspect `src/mcp.ts` and `test/mcp.test.ts`, then verify tool contracts and OAuth scopes against `../mcp/src/tools/contracts.ts` and `../mcp/src/http/oauth.ts`.
- Installer or command behavior: inspect `src/cli.ts`, `src/installer.ts`, `src/update.ts`, and the installer/update tests; confirm supported agent targets and project/global paths from the implementation.
- Package, docs, or release: inspect `package.json`, `package-lock.json`, `README.md`, and `.github/workflows/publish.yml` before changing their behavior.
