import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';
import path from 'path';

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function readPackageMeta(): { name: string; version: string } {
    try {
        const raw = readFileSync(
            path.join(process.cwd(), 'package.json'),
            'utf8',
        );
        const j = JSON.parse(raw) as { name?: string; version?: string };
        return {
            name: typeof j.name === 'string' ? j.name : '',
            version: typeof j.version === 'string' ? j.version : '',
        };
    } catch {
        return { name: '', version: '' };
    }
}

function resolveGitBranch(): string {
    if (process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH) {
        return process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH;
    }
    if (process.env.VITE_CLIPPER_QA_GIT_BRANCH) {
        return process.env.VITE_CLIPPER_QA_GIT_BRANCH;
    }
    if (process.env.VERCEL_GIT_COMMIT_REF) {
        return process.env.VERCEL_GIT_COMMIT_REF;
    }
    if (process.env.GITHUB_HEAD_REF) {
        return process.env.GITHUB_HEAD_REF;
    }
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', {
            encoding: 'utf8',
        }).trim();
    } catch {
        return '';
    }
}

const pkg = readPackageMeta();
const gitBranch = resolveGitBranch();

// Передаем точный путь к текущему проекту
// Подключаем эмуляцию D1 и .dev.vars для режима локальной разработки (next dev)
initOpenNextCloudflareForDev({
    configPath: path.resolve(process.cwd(), 'wrangler.toml'), // или 'wrangler.toml'
});

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_CLIPPER_QA_APP_NAME:
            process.env.NEXT_PUBLIC_CLIPPER_QA_APP_NAME ||
            process.env.VITE_CLIPPER_QA_APP_NAME ||
            pkg.name,
        NEXT_PUBLIC_CLIPPER_QA_APP_VERSION:
            process.env.NEXT_PUBLIC_CLIPPER_QA_APP_VERSION ||
            process.env.VITE_CLIPPER_QA_APP_VERSION ||
            pkg.version,
        NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH:
            process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH ||
            process.env.VITE_CLIPPER_QA_GIT_BRANCH ||
            gitBranch,
    },
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
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
                    },
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
        // 2560 добавлен для Retina: герой кейса 1072 CSS-px × DPR 2 = 2144,
        // без него браузер растягивал 1920-кандидат → обложка мылилась.
        deviceSizes: [828, 1920, 2560],
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
