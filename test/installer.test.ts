import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { installSkills } from '../src/installer.js';

describe('installSkills', () => {
  const roots: string[] = [];
  afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

  it('copies all four public skills into the selected agent project directory', async () => {
    const root = await mkdtemp(join(tmpdir(), 'madabina-skills-'));
    roots.push(root);
    await installSkills({ agent: 'codex', scope: 'project', cwd: root });

    const skill = await readFile(join(root, '.agents', 'skills', 'madabina-platform', 'SKILL.md'), 'utf8');
    expect(skill).toContain('name: madabina-platform');
    await expect(readFile(join(root, '.agents', 'skills', 'madabina-api', 'SKILL.md'), 'utf8')).resolves.toContain('name: madabina-api');
    await expect(readFile(join(root, '.agents', 'skills', 'madabina-mcp', 'SKILL.md'), 'utf8')).resolves.toContain('name: madabina-mcp');
    await expect(readFile(join(root, '.agents', 'skills', 'madabina-brand', 'SKILL.md'), 'utf8')).resolves.toContain('name: madabina-brand');
  });

  it('supports global installation under an explicit home directory', async () => {
    const home = await mkdtemp(join(tmpdir(), 'madabina-skills-home-'));
    roots.push(home);
    await installSkills({ agent: 'claude', scope: 'global', homeDir: home });

    await expect(readFile(join(home, '.claude', 'skills', 'madabina-platform', 'SKILL.md'), 'utf8')).resolves.toContain('Madabina');
  });

  it('installs Chriki skills where Pi discovers project and user skills', async () => {
    const root = await mkdtemp(join(tmpdir(), 'madabina-skills-chriki-'));
    roots.push(root);

    const projectPaths = await installSkills({ agent: 'chriki', scope: 'project', cwd: root });
    const globalPaths = await installSkills({ agent: 'chriki', scope: 'global', homeDir: root });

    expect(projectPaths[0]).toContain(join('.agents', 'skills', 'madabina-platform'));
    expect(globalPaths[0]).toContain(join('.agents', 'skills', 'madabina-platform'));
    await expect(readFile(join(root, '.agents', 'skills', 'madabina-mcp', 'SKILL.md'), 'utf8')).resolves.toContain('name: madabina-mcp');
  });
});
