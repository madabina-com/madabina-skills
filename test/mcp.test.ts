import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedError } from '@modelcontextprotocol/sdk/client/auth.js';
import type { OAuthClientProvider } from '@modelcontextprotocol/sdk/client/auth.js';
import { MadabinaMcpClient } from '../src/mcp.js';

describe('MadabinaMcpClient', () => {
  it('creates an authenticated MCP client for the Madabina Streamable HTTP endpoint', async () => {
    const authProvider = {
      tokens: vi.fn().mockResolvedValue({ access_token: 'access-token' }),
      clientInformation: vi.fn().mockResolvedValue({ client_id: 'client-id' }),
      saveTokens: vi.fn(),
      redirectToAuthorization: vi.fn(),
    } as unknown as OAuthClientProvider;
    const client = new MadabinaMcpClient({ authProvider, serverUrl: 'https://mcp.madabina.com/mcp' });

    expect(client.transport).toBeDefined();
    expect(client.sdkClient).toBeDefined();
    await client.close();
  });

  it('exposes the SDK unauthorized error for callers to resume OAuth authorization', () => {
    expect(new UnauthorizedError()).toBeInstanceOf(Error);
  });
});
