export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8765',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
} as const;

export type Config = typeof config;
