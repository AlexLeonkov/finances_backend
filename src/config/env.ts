import { config } from 'dotenv';

config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  postgresUrl: string;
}

function getEnvConfig(): EnvConfig {
  const port = parseInt(process.env.PORT || '3000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';
  const postgresUrl = process.env.POSTGRES_URL;

  if (!postgresUrl) {
    throw new Error('POSTGRES_URL environment variable is required');
  }

  return {
    port,
    nodeEnv,
    postgresUrl,
  };
}

export const env = getEnvConfig();

