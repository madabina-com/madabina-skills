#!/usr/bin/env node
import { installSkills, type Agent, type InstallScope } from './installer.js';

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'install' || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: npx madabina-skills install --agent <codex|claude> [--global]');
    if (command !== 'install') process.exitCode = command === undefined ? 0 : 2;
    return;
  }

  const agent = option(args, '--agent') as Agent | undefined;
  if (agent !== 'codex' && agent !== 'claude') throw new Error('Choose an agent with --agent codex or --agent claude.');
  const scope: InstallScope = args.includes('--global') ? 'global' : 'project';
  const installed = await installSkills({ agent, scope });
  console.log(`Installed ${installed.length} Madabina skills (${scope}):\n${installed.join('\n')}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
