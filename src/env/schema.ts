import { z } from 'zod';

export const serverEnvSchema = z.object({
  PORT: z.coerce.number(),
  CORS_ORIGIN: z.string().optional(),
  ENABLE_MUTATIONS: z
    .preprocess((val) => val === 'true', z.boolean())
    .default(false),
});
