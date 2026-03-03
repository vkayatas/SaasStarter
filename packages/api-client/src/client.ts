import type { z } from 'zod';
import type {
  CollectionSchema,
  CreateCollectionSchema,
  CreateNoteSchema,
  NoteSchema,
  UpdateCollectionSchema,
  UpdateNoteSchema,
} from './schemas';
import type { PaginatedResponse } from './types';

class ApiError extends Error {
  status: number;
  code: string;

  constructor(response: Response, body?: { error: string; code: string }) {
    super(body?.error ?? `API error: ${response.status}`);
    this.status = response.status;
    this.code = body?.code ?? 'UNKNOWN';
  }
}

export function createApiClient(
  baseUrl: string,
  getToken: () => Promise<string | null>,
) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await getToken();
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      throw new ApiError(response, body);
    }

    return response.json();
  }

  return {
    collections: {
      list: (params?: { cursor?: string; limit?: number }) =>
        request<PaginatedResponse<z.infer<typeof CollectionSchema>>>(
          `/api/v1/collections${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''}`,
        ),
      get: (id: string) =>
        request<{ data: z.infer<typeof CollectionSchema> }>(`/api/v1/collections/${id}`),
      create: (data: z.infer<typeof CreateCollectionSchema>) =>
        request<{ data: z.infer<typeof CollectionSchema> }>('/api/v1/collections', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: z.infer<typeof UpdateCollectionSchema>) =>
        request<{ data: z.infer<typeof CollectionSchema> }>(`/api/v1/collections/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ data: { id: string; deleted: true } }>(`/api/v1/collections/${id}`, {
          method: 'DELETE',
        }),
    },
    notes: {
      list: (params?: { cursor?: string; limit?: number }) =>
        request<PaginatedResponse<z.infer<typeof NoteSchema>>>(
          `/api/v1/notes${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''}`,
        ),
      get: (id: string) =>
        request<{ data: z.infer<typeof NoteSchema> }>(`/api/v1/notes/${id}`),
      create: (data: z.infer<typeof CreateNoteSchema>) =>
        request<{ data: z.infer<typeof NoteSchema> }>('/api/v1/notes', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: z.infer<typeof UpdateNoteSchema>) =>
        request<{ data: z.infer<typeof NoteSchema> }>(`/api/v1/notes/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ data: { id: string; deleted: true } }>(`/api/v1/notes/${id}`, {
          method: 'DELETE',
        }),
    },
    users: {
      me: () => request<{ data: { id: string; email: string; name: string | null; role: string } }>('/api/v1/users/me'),
    },
    health: () => request<{ status: string; timestamp: string }>('/api/v1/health'),
  };
}

export { ApiError };
