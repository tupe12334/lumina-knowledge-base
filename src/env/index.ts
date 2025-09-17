import { loadEnv } from './load-env';

const env = loadEnv();
const loadEnvFunction = loadEnv;

export { env, loadEnvFunction };
