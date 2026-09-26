import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';
import path from 'path';

// Передаем точный путь к текущему проекту
// Подключаем эмуляцию D1 и .dev.vars для режима локальной разработки (next dev)
initOpenNextCloudflareForDev({
    configPath: path.resolve(process.cwd(), 'wrangler.toml'), // или 'wrangler.toml'
});

const nextConfig: NextConfig = {
    /* config options here */
    // Не отдавать версию фреймворка в заголовке X-Powered-By (инфо-утечка).
    poweredByHeader: false,
    // Безопасные HTTP-заголовки для всех маршрутов. CSP сознательно не
    // задан: глобальный nonce-CSP конфликтует со script-инъекцией темы в
    // src/app/layout.tsx и inline-скриптами Next — см. Docs/DEPLOY.md
    // (раздел «CSP»). Остальные заголовки не ломают сборку.
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
                    {
                        // HSTS: браузер запоминает, что на ux42.studio можно
                        // ходить только по HTTPS (2 года + поддомены).
                        // Безопасно: custom domain уже отдаётся по HTTPS.
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains',
                    },
                ],
            },
        ];
    },
    images: {
        loader: 'custom',
        loaderFile: './image-loader.ts',
        // В dev /cdn-cgi/image недоступен — loader возвращает src без width,
        // и Next 16 сыплет предупреждениями next-image-missing-loader-width.
        unoptimized: process.env.NODE_ENV === 'development',
        deviceSizes: [828, 1920],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.ux42.studio',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
