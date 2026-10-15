export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class MadabinaApiError extends Error {
  constructor(message: string, readonly status: number, readonly details?: unknown) {
    super(message);
    this.name = 'MadabinaApiError';
  }
}

export interface MadabinaRestClientOptions {
  /** API root, for example https://madabina.com/api/v1. */
  baseUrl?: string;
  /** Existing access token. Login is optional when tokens are managed by the host app. */
  token?: string;
  /** Fetch-compatible implementation, useful for runtimes and tests. */
  fetch?: FetchLike;
}

export interface LoginCredentials { email: string; password: string }
export interface UserProfile { uuid: string; email: string; storeName?: string | null; phone?: string | null; currency: string; defaultLanguage: string; stores?: StoreProfile[] }
export interface StoreProfile { uuid: string; name: string; slug: string; phone?: string | null; currency: string; defaultLanguage: string }
export interface Product { uuid: string; storeUuid?: string; sku?: string | null; titleFr: string; titleAr?: string | null; titleEn: string; category?: string | null; price: number; stockQuantity: number; isVisibleOnStore: boolean; imageUrl?: string | null; [key: string]: unknown }
export interface Customer { uuid: string; name: string; phone: string; address?: string | null; city?: string | null; totalOrdersCount: number; [key: string]: unknown }
export interface Order { uuid: string; orderNumber: string; status: string; paymentStatus: string; totalAmount: number; currencyCode?: string; [key: string]: unknown }
export interface ApiPage<T> { items: T[]; page: number; perPage: number; total: number; lastPage: number }
export type Query = Record<string, string | number | boolean | null | undefined>;
export type ProductCategory = 'ELECTRONICS' | 'FASHION' | 'BEAUTY' | 'HOME' | 'CRAFTS';
export interface ProductVariantInput { uuid?: string; sku: string; attribute?: string; color?: string; size?: string; customAttribute?: string; price: number; compareAtPrice?: number; stockQuantity: number }
export interface ProductInput {
  storeUuid?: string;
  sku?: string;
  titleFr: string;
  titleAr: string;
  titleEn: string;
  descriptionFr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  productType?: 'simple' | 'variable';
  costPrice?: number;
  stockQuantity: number;
  minStockAlert?: number;
  isVisibleOnStore?: boolean;
  imageUrl?: string;
  variants?: ProductVariantInput[];
}
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export interface CreateOrderInput {
  storeUuid?: string;
  customer: { name: string; phone: string; address: string; city: string; notes?: string };
  paymentMethod: 'CASH_ON_DELIVERY' | 'BANK_CARD';
  shippingCarrier?: string;
  trackingNumber?: string;
  shippingFee?: number;
  internalNotes?: string;
  items: Array<{ productUuid: string; variantUuid?: string; quantity: number }>;
}

export class MadabinaRestClient {
  private accessToken?: string;
  private refreshToken?: string;
  private refreshInFlight?: Promise<void>;
  private readonly responseMeta = new WeakMap<object, Record<string, unknown>>();
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;

  constructor(options: MadabinaRestClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? 'https://madabina.com/api/v1').replace(/\/+$/, '');
    this.accessToken = options.token;
    this.fetchImpl = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  setTokens(tokens: Partial<TokenPair>): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }

  clearTokens(): void { this.accessToken = undefined; this.refreshToken = undefined; }

  async login(credentials: LoginCredentials): Promise<{ tokens: TokenPair; user: UserProfile }> {
    this.clearTokens();
    const result = await this.request<{ accessToken: string; refreshToken: string; expiresIn?: number; tokenType?: string; user: UserProfile }>(
      '/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, false,
    );
    this.setTokens(result);
    return { tokens: result, user: result.user };
  }

  async refresh(): Promise<TokenPair> {
    if (!this.refreshToken) throw new MadabinaApiError('No refresh token is available.', 401);
    try {
      const result = await this.request<TokenPair>('/auth/refresh', {
        method: 'POST', body: JSON.stringify({ refreshToken: this.refreshToken }),
      }, false);
      this.setTokens(result);
      return result;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (this.refreshToken) await this.request<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: this.refreshToken }) });
    this.clearTokens();
  }

  me(): Promise<{ user: UserProfile }> { return this.request('/auth/me'); }
  statsOverview<T extends Record<string, unknown> = Record<string, unknown>>(): Promise<T> { return this.request('/stats/overview'); }
  async listProducts(query: Query = {}): Promise<ApiPage<Product>> { return this.page('/products', 'products', query); }
  getProduct(uuid: string): Promise<{ product: Product }> { return this.request(`/products/${encodeURIComponent(uuid)}`); }
  createProduct(payload: ProductInput): Promise<{ product: Product }> { return this.request('/products', { method: 'POST', body: JSON.stringify(payload) }); }
  updateProduct(uuid: string, payload: ProductInput): Promise<{ product: Product }> { return this.request(`/products/${encodeURIComponent(uuid)}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  updateStock(uuid: string, payload: { delta?: number; newQuantity?: number }): Promise<{ product: Product }> { return this.request(`/products/${encodeURIComponent(uuid)}/stock`, { method: 'PATCH', body: JSON.stringify(payload) }); }
  updateProductVisibility(uuid: string, isVisible: boolean): Promise<{ product: Product }> { return this.request(`/products/${encodeURIComponent(uuid)}/visibility`, { method: 'PATCH', body: JSON.stringify({ isVisible }) }); }
  deleteProduct(uuid: string): Promise<void> { return this.request(`/products/${encodeURIComponent(uuid)}`, { method: 'DELETE' }); }
  async listOrders(query: Query = {}): Promise<ApiPage<Order>> { return this.page('/orders', 'orders', query); }
  getOrder(uuid: string): Promise<{ order: Order }> { return this.request(`/orders/${encodeURIComponent(uuid)}`); }
  createOrder(payload: CreateOrderInput): Promise<{ order: Order }> { return this.request('/orders', { method: 'POST', body: JSON.stringify(payload) }); }
  updateOrderStatus(uuid: string, status: OrderStatus): Promise<{ order: Order }> { return this.request(`/orders/${encodeURIComponent(uuid)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
  updateOrderTracking(uuid: string, payload: { carrier: string; trackingNumber?: string | null }): Promise<{ order: Order }> { return this.request(`/orders/${encodeURIComponent(uuid)}/tracking`, { method: 'PATCH', body: JSON.stringify(payload) }); }
  updateOrderPaymentStatus(uuid: string, paymentStatus: string): Promise<{ order: Order }> { return this.request(`/orders/${encodeURIComponent(uuid)}/payment-status`, { method: 'PATCH', body: JSON.stringify({ paymentStatus }) }); }
  cancelOrder(uuid: string): Promise<{ order: Order }> { return this.request(`/orders/${encodeURIComponent(uuid)}`, { method: 'DELETE' }); }
  async listCustomers(query: Query = {}): Promise<ApiPage<Customer>> { return this.page('/customers', 'customers', query); }
  getCustomer(uuid: string): Promise<{ customer: Customer }> { return this.request(`/customers/${encodeURIComponent(uuid)}`); }

  private async page<T>(path: string, key: string, query: Query): Promise<ApiPage<T>> {
    const response = await this.request<Record<string, unknown>>(`${path}${this.query(query)}`);
    const items = response[key] as T[];
    const meta = this.responseMeta.get(response) as Record<string, number> | undefined;
    return { items, page: meta?.page ?? 1, perPage: meta?.perPage ?? items.length, total: meta?.total ?? items.length, lastPage: meta?.lastPage ?? 1 };
  }

  private query(query: Query): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== null) params.set(key, String(value));
    const encoded = params.toString();
    return encoded ? `?${encoded}` : '';
  }

  private async request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body !== undefined) headers.set('Content-Type', 'application/json');
    if (this.accessToken) headers.set('Authorization', `Bearer ${this.accessToken}`);
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers });

    const isAuthEndpoint = ['/auth/login', '/auth/refresh', '/auth/logout'].includes(path);
    if (response.status === 401 && retry && this.refreshToken && !isAuthEndpoint) {
      this.refreshInFlight ??= this.refresh().then(() => undefined).finally(() => { this.refreshInFlight = undefined; });
      await this.refreshInFlight;
      return this.request<T>(path, init, false);
    }

    const body = response.status === 204 ? undefined : await response.json().catch(() => undefined) as ApiSuccess<T> | ApiFailure | T | undefined;
    if (!response.ok) {
      const failure = body && typeof body === 'object' && 'success' in body ? body as ApiFailure : undefined;
      throw new MadabinaApiError(failure?.message ?? `Madabina API request failed (${response.status}).`, response.status, failure?.details);
    }
    if (body && typeof body === 'object' && 'success' in body) {
      const envelope = body as ApiSuccess<T> | ApiFailure;
      if (!envelope.success) throw new MadabinaApiError(envelope.message, response.status, envelope.details);
      const data = envelope.data as T;
      if (data && typeof data === 'object') this.responseMeta.set(data, envelope.meta ?? {});
      return data;
    }
    return body as T;
  }
}
