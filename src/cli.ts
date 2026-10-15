#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSkills, type Agent, type InstallScope } from './installer.js';
import { checkAndInstallLatestSkills } from './update.js';

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || command === undefined || command === '--help' || command === '-h') {
    console.log([
      'Usage:',
      '  npx madabina-skills install --agent <codex|claude|chriki> [--global]',
      '  npx madabina-skills update --agent <codex|claude|chriki> [--global]',
      '',
      'Both commands check npm for a newer release before copying skills.',
    ].join('\n'));
    return;
  }
  if (command !== 'install' && command !== 'update') {
    console.error(`Unknown command: ${command}`);
    process.exitCode = 2;
    return;
  }

  const agent = option(args, '--agent') as Agent | undefined;
  if (agent !== 'codex' && agent !== 'claude' && agent !== 'chriki') {
    throw new Error('Choose an agent with --agent codex, --agent claude, or --agent chriki.');
  }
  const scope: InstallScope = args.includes('--global') ? 'global' : 'project';

  if (args.includes('--no-update-check')) {
    const installed = await installSkills({ agent, scope });
    console.log(`Installed ${installed.length} Madabina skills (${scope}):\n${installed.join('\n')}`);
    return;
  }

  const packagePath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
  const { version } = JSON.parse(await readFile(packagePath, 'utf8')) as { version: string };
  const result = await checkAndInstallLatestSkills({
    currentVersion: version,
    agent,
    scope,
    installCurrent: () => installSkills({ agent, scope }),
    runLatest: (latestVersion, selectedAgent, selectedScope) => runLatestInstaller(latestVersion, selectedAgent, selectedScope),
  });

  if (result.warning) console.warn(`Could not check npm for updates (${result.warning}); using the bundled skills.`);
  if (result.updated) {
    console.log(`Updated Madabina skills to package version ${result.version} (${scope}).`);
  } else {
    console.log(`Installed ${result.installedPaths.length} Madabina skills from package version ${result.version} (${scope}):\n${result.installedPaths.join('\n')}`);
  }
}

function runLatestInstaller(version: string, agent: Agent, scope: InstallScope): Promise<void> {
  const args = [
    'exec', '--yes', '--package', `madabina-skills@${version}`, '--',
    'madabina-skills', 'install', '--agent', agent,
    ...(scope === 'global' ? ['--global'] : []),
    '--no-update-check',
  ];
  const npmExecPath = process.env.npm_execpath;
  const executable = npmExecPath ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
  const executableArgs = npmExecPath ? [npmExecPath, ...args] : args;

  return new Promise((resolve, reject) => {
    const child = spawn(executable, executableArgs, {
      stdio: 'inherit',
      shell: !npmExecPath && process.platform === 'win32',
    });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm exec exited with code ${code ?? 'unknown'}.`));
    });
  });
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
