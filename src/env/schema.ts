import { z } from 'zod';

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGIN: z
    .string()
    .transform((s) =>
      s
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
    )
    .pipe(z.array(z.string()).min(1))
    .optional(),
  ENABLE_MUTATIONS: z
    .preprocess((val) => val === true || val === 'true', z.boolean())
    .default(false),
});
