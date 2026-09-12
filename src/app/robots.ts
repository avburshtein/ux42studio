import type { MetadataRoute } from 'next';

// C3 (решение (42)): robots.txt — публичный контент индексируется,
// приватные зоны (админки, auth, API) закрыты для краулеров; noindex-meta
// в layouts — второй рубеж (спека (42)).
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/super-admin', '/login', '/register', '/api'],
            },
        ],
        sitemap: 'https://ux42.studio/sitemap.xml',
    };
}
