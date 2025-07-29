import { loadEnv } from '@lumina/env-config';
import { serverEnvSchema } from './schema';

export const env = loadEnv(serverEnvSchema);
