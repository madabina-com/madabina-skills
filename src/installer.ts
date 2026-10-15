import { cp, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Agent = 'codex' | 'claude';
export type InstallScope = 'project' | 'global';

export interface InstallOptions {
  agent: Agent;
  scope?: InstallScope;
  cwd?: string;
  homeDir?: string;
  packageRoot?: string;
}

const agentDirectory: Record<Agent, string> = { codex: '.agents', claude: '.claude' };
const packageRootFromModule = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function installSkills(options: InstallOptions): Promise<string[]> {
  const scope = options.scope ?? 'project';
  const base = scope === 'global' ? (options.homeDir ?? homedir()) : (options.cwd ?? process.cwd());
  const destinationRoot = join(base, agentDirectory[options.agent], 'skills');
  const sourceRoot = join(options.packageRoot ?? packageRootFromModule, 'skills');
  const names = ['madabina-platform', 'madabina-api', 'madabina-mcp'];

  for (const name of names) {
    const destination = join(destinationRoot, name);
    await mkdir(dirname(destination), { recursive: true });
    await cp(join(sourceRoot, name), destination, { recursive: true, force: true });
  }
  return names.map((name) => join(destinationRoot, name));
}
