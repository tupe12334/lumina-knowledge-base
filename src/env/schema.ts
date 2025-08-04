import { z } from 'zod';

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
  CORS_ORIGIN: z.string().optional(),
});
