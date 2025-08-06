import { z } from 'zod';

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string(), // Changed from z.string().url() to allow file: protocol for SQLite
  PORT: z.coerce.number(),
  CORS_ORIGIN: z.string().optional(),
});
