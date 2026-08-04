import 'dotenv/config'; // Подгружает переменные из .env / .env.local
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './db/schema/index.ts',
    dialect: 'sqlite',
    driver: 'd1-http',
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: '67d7cb5f-5397-48b6-ae54-f7ac877e251e',
        token: process.env.CLOUDFLARE_D1_TOKEN!,
    },
});
