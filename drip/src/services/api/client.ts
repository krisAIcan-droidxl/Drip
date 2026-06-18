import { AppError, toAppError } from '@/src/security/safeErrors';

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiRequest<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 12000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) throw new AppError('unauthorized', 'Unauthorized.');
      if (response.status === 403) throw new AppError('forbidden', 'Forbidden.');
      if (response.status === 429) throw new AppError('rate_limited', 'Rate limited.');
      throw new AppError('service_unavailable', `Request failed with status ${response.status}.`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppError('network_error', 'Request timed out.', error);
    }
    throw toAppError(error, 'network_error');
  } finally {
    clearTimeout(timeout);
  }
}
