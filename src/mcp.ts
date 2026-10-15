import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { OAuthClientProvider } from '@modelcontextprotocol/sdk/client/auth.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export const MADABINA_MCP_URL = 'https://mcp.madabina.com/mcp';
export const MADABINA_OAUTH_ISSUER = 'https://madabina.com';
export const MADABINA_OAUTH_SCOPES = [
  'madabina.read',
  'madabina.products.write',
  'madabina.orders.write',
  'madabina.destructive',
] as const;

export interface MadabinaMcpClientOptions {
  /** OAuth provider implemented by the host app. It owns token and PKCE state storage. */
  authProvider: OAuthClientProvider;
  serverUrl?: string | URL;
  clientName?: string;
  clientVersion?: string;
}

/** Thin Streamable HTTP client; the MCP SDK drives OAuth discovery, PKCE and token refresh. */
export class MadabinaMcpClient {
  readonly sdkClient: Client;
  readonly transport: StreamableHTTPClientTransport;

  constructor(options: MadabinaMcpClientOptions) {
    this.sdkClient = new Client({ name: options.clientName ?? 'madabina-skills', version: options.clientVersion ?? '0.1.0' });
    this.transport = new StreamableHTTPClientTransport(new URL(options.serverUrl ?? MADABINA_MCP_URL), {
      authProvider: options.authProvider,
      requestInit: { headers: { Accept: 'application/json, text/event-stream' } },
    });
  }

  async connect(): Promise<void> { await this.sdkClient.connect(this.transport); }
  async finishAuth(authorizationCode: string): Promise<void> { await this.transport.finishAuth(authorizationCode); }
  async listTools() { return this.sdkClient.listTools(); }
  async callTool(name: string, args: Record<string, unknown>) { return this.sdkClient.callTool({ name, arguments: args }); }
  async readResource(uri: string) { return this.sdkClient.readResource({ uri }); }
  async close(): Promise<void> { await this.sdkClient.close(); }
}
