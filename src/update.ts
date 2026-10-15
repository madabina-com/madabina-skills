import type { Agent, InstallScope } from './installer.js';

const registryLatestUrl = 'https://registry.npmjs.org/madabina-skills/latest';
const stableVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export interface AutoUpdateOptions {
  currentVersion: string;
  agent: Agent;
  scope: InstallScope;
  fetcher?: typeof fetch;
  installCurrent: () => Promise<string[]>;
  runLatest: (version: string, agent: Agent, scope: InstallScope) => Promise<void>;
}

export interface AutoUpdateResult {
  version: string;
  updated: boolean;
  installedPaths: string[];
  warning?: string;
}

function compareStableVersions(left: string, right: string): number {
  const leftMatch = stableVersionPattern.exec(left);
  const rightMatch = stableVersionPattern.exec(right);
  if (!leftMatch || !rightMatch) throw new Error('npm returned an invalid stable package version.');

  for (let index = 1; index <= 3; index++) {
    const difference = Number(leftMatch[index]) - Number(rightMatch[index]);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

export async function checkAndInstallLatestSkills(options: AutoUpdateOptions): Promise<AutoUpdateResult> {
  let latestVersion: string;

  try {
    const response = await (options.fetcher ?? fetch)(registryLatestUrl, {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) throw new Error(`npm registry returned HTTP ${response.status}.`);

    const metadata: unknown = await response.json();
    if (typeof metadata !== 'object' || metadata === null || !('version' in metadata) || typeof metadata.version !== 'string') {
      throw new Error('npm registry returned invalid package metadata.');
    }
    latestVersion = metadata.version;
    if (!stableVersionPattern.test(latestVersion)) throw new Error('npm registry returned an invalid stable package version.');
    if (!stableVersionPattern.test(options.currentVersion)) throw new Error('The installed Madabina Skills version is invalid.');
  } catch (error) {
    const installedPaths = await options.installCurrent();
    return {
      version: options.currentVersion,
      updated: false,
      installedPaths,
      warning: error instanceof Error ? error.message : String(error),
    };
  }

  if (compareStableVersions(latestVersion, options.currentVersion) > 0) {
    await options.runLatest(latestVersion, options.agent, options.scope);
    return { version: latestVersion, updated: true, installedPaths: [] };
  }

  const installedPaths = await options.installCurrent();
  return { version: options.currentVersion, updated: false, installedPaths };
}
