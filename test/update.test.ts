import { describe, expect, it, vi } from 'vitest';
import { checkAndInstallLatestSkills } from '../src/update.js';

describe('checkAndInstallLatestSkills', () => {
  it('runs the latest CLI when npm has a newer package version', async () => {
    const installCurrent = vi.fn(async () => ['current-skill-path']);
    const runLatest = vi.fn(async () => undefined);
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ version: '0.1.10' }), { status: 200 }));

    const result = await checkAndInstallLatestSkills({
      currentVersion: '0.1.1',
      agent: 'chriki',
      scope: 'global',
      fetcher,
      installCurrent,
      runLatest,
    });

    expect(result).toEqual({ version: '0.1.10', updated: true, installedPaths: [] });
    expect(runLatest).toHaveBeenCalledWith('0.1.10', 'chriki', 'global');
    expect(installCurrent).not.toHaveBeenCalled();
  });

  it('copies bundled skills without relaunching when this package is current', async () => {
    const installCurrent = vi.fn(async () => ['skill-path']);
    const runLatest = vi.fn(async () => undefined);
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ version: '0.1.1' }), { status: 200 }));

    const result = await checkAndInstallLatestSkills({
      currentVersion: '0.1.1',
      agent: 'claude',
      scope: 'global',
      fetcher,
      installCurrent,
      runLatest,
    });

    expect(result).toEqual({ version: '0.1.1', updated: false, installedPaths: ['skill-path'] });
    expect(installCurrent).toHaveBeenCalledOnce();
    expect(runLatest).not.toHaveBeenCalled();
  });

  it('falls back to bundled skills when the registry is unreachable', async () => {
    const installCurrent = vi.fn(async () => ['skill-path']);
    const runLatest = vi.fn(async () => undefined);
    const fetcher = vi.fn(async () => { throw new Error('network unavailable'); });

    const result = await checkAndInstallLatestSkills({
      currentVersion: '0.1.1',
      agent: 'codex',
      scope: 'global',
      fetcher,
      installCurrent,
      runLatest,
    });

    expect(result).toEqual({ version: '0.1.1', updated: false, installedPaths: ['skill-path'], warning: 'network unavailable' });
    expect(installCurrent).toHaveBeenCalledOnce();
    expect(runLatest).not.toHaveBeenCalled();
  });
});
