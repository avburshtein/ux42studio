import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    // Для локальной генерации/миграций через wrangler D1
    wranglerConfigPath: 'wrangler.toml',
    dbName: 'YOUR_DB_NAME', // Укажите имя вашей D1 базы из wrangler.toml
  },
} satisfies Config;