import { z } from '@lumina/env-config';

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().optional(),
});
