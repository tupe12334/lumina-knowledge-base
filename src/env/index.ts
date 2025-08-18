import { serverEnvSchema } from './schema';

/**
 * Parse and validate environment variables from a given source.
 * Keeps function small and predictable for unit testing.
 */
export const loadEnv = (source: NodeJS.ProcessEnv = process.env) => {
  const parsed = serverEnvSchema.parse(source);
  return parsed;
};

export let env = loadEnv();
