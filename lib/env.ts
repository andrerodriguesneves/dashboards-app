export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
}; 