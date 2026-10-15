import { describe, expect, it, vi } from 'vitest';
import { MadabinaApiError, MadabinaRestClient } from '../src/rest.js';

describe('MadabinaRestClient', () => {
  it('logs in, retains the token pair and uses the access token for private calls', async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(Response.json({ success: true, data: { accessToken: 'access-1', refreshToken: 'refresh-1', user: { uuid: 'merchant-1' } } }))
      .mockResolvedValueOnce(Response.json({ success: true, data: { user: { uuid: 'merchant-1' } } }));
    const client = new MadabinaRestClient({ baseUrl: 'https://madabina.example/api/v1', fetch });

    await client.login({ email: 'owner@example.com', password: 'secret' });
    const profile = await client.me();

    expect(profile.user.uuid).toBe('merchant-1');
    expect(new Headers(fetch.mock.calls[1]?.[1]?.headers).get('Authorization')).toBe('Bearer access-1');
  });

  it('refreshes credentials after a 401 and retries the request once', async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(Response.json({ success: true, data: { accessToken: 'old', refreshToken: 'refresh' } }))
      .mockResolvedValueOnce(Response.json({ success: false, message: 'Expired', statusCode: 401 }, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ success: true, data: { accessToken: 'new', refreshToken: 'next' } }))
      .mockResolvedValueOnce(Response.json({ success: true, data: { user: { uuid: 'm1' } } }));
    const client = new MadabinaRestClient({ baseUrl: 'https://madabina.example/api/v1', fetch });

    await client.login({ email: 'owner@example.com', password: 'secret' });
    await client.me();

    expect(fetch).toHaveBeenCalledTimes(4);
    expect(new Headers(fetch.mock.calls[3]?.[1]?.headers).get('Authorization')).toBe('Bearer new');
  });

  it('throws a typed error containing the API response when the request fails', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ success: false, message: 'Not found', statusCode: 404 }, { status: 404 }));
    const client = new MadabinaRestClient({ baseUrl: 'https://madabina.example/api/v1', token: 'token', fetch });

    await expect(client.getProduct('missing')).rejects.toMatchObject({ name: 'MadabinaApiError', status: 404, message: 'Not found' });
    await expect(client.getProduct('missing')).rejects.toBeInstanceOf(MadabinaApiError);
  });

  it('preserves pagination metadata while exposing the resource list', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ success: true, data: { products: [{ uuid: 'p-1' }] }, meta: { page: 2, perPage: 10, total: 11, lastPage: 2 } }));
    const client = new MadabinaRestClient({ baseUrl: 'https://madabina.example/api/v1', token: 'token', fetch });

    await expect(client.listProducts({ search: 'blue phone', isVisible: true })).resolves.toMatchObject({ items: [{ uuid: 'p-1' }], page: 2, perPage: 10, total: 11, lastPage: 2 });
    expect(String(fetch.mock.calls[0]?.[0])).toContain('search=blue+phone');
  });

  it('clears credentials after the server rejects the refresh token', async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(Response.json({ success: true, data: { accessToken: 'old', refreshToken: 'revoked' } }))
      .mockResolvedValueOnce(Response.json({ success: false, message: 'Expired access token' }, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ success: false, message: 'Invalid refresh token' }, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ success: false, message: 'Unauthorized' }, { status: 401 }));
    const client = new MadabinaRestClient({ baseUrl: 'https://madabina.example/api/v1', fetch });
    await client.login({ email: 'owner@example.com', password: 'secret' });
    await expect(client.me()).rejects.toMatchObject({ status: 401, message: 'Invalid refresh token' });
    await expect(client.me()).rejects.toMatchObject({ status: 401, message: 'Unauthorized' });

    expect(fetch.mock.calls[3]?.[1]).not.toMatchObject({ headers: expect.objectContaining({ Authorization: expect.any(String) }) });
  });
});
