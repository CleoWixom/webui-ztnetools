export type ZtMethod = 'GET' | 'POST' | 'DELETE';

export interface ZtApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
}

export interface ZtApiContext {
  host: string;
  token: string;
  onNetworkError?: (message: string) => void;
}

export interface ZtRequestOptions {
  body?: unknown;
  btnId?: string;
}

async function request<T>(
  method: ZtMethod,
  path: string,
  ctx: ZtApiContext,
  options: ZtRequestOptions = {},
): Promise<ZtApiResponse<T> | null> {
  const btn = options.btnId ? document.getElementById(options.btnId) : null;
  if (btn) btn.classList.add('loading');

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'X-ZT1-AUTH': ctx.token,
        'Content-Type': 'application/json',
      },
    };

    if (options.body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const res = await fetch(ctx.host + path, fetchOptions);
    let data: T | null;
    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }

    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    ctx.onNetworkError?.(`Network error: ${message}`);
    return null;
  } finally {
    if (btn) btn.classList.remove('loading');
  }
}

export function ztGet<T>(path: string, ctx: ZtApiContext, options: Omit<ZtRequestOptions, 'body'> = {}) {
  return request<T>('GET', path, ctx, options);
}

export function ztPost<T>(path: string, ctx: ZtApiContext, body?: unknown, options: Omit<ZtRequestOptions, 'body'> = {}) {
  return request<T>('POST', path, ctx, { ...options, body });
}

export function ztDelete<T>(path: string, ctx: ZtApiContext, options: Omit<ZtRequestOptions, 'body'> = {}) {
  return request<T>('DELETE', path, ctx, options);
}
