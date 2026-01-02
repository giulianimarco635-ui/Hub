import { z } from 'zod';
import { catalogSchema } from './schema';

export const errorSchemas = {
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  feed: {
    get: {
      method: 'GET' as const,
      path: '/api/feed',
      responses: {
        200: catalogSchema,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CatalogResponse = z.infer<typeof api.feed.get.responses[200]>;
