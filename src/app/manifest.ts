import type { MetadataRoute } from 'next';

/**
 * PWA-манифест (`/manifest.webmanifest`) — App Router file convention.
 *
 * Нужен для: «Установить приложение» на Android/Chrome (у ux42.studio есть
 * приватная админка, которой удобно пользоваться как приложением), для
 * корректной иконки в «Настройках приложений» Android и для маскировки
 * цвета статус-бара. Статические ассеты, поэтому HEX разрешён (те же
 * значения, что в globals.css: primary-container #0B6E4F, background #F7FAF5).
 *
 * Цвета иконок: `src/app/icon.png` (фавикон 634×634, PNG) и
 * `public/og/og-cover.png` (1200×630). Отдельные 192/512 PNG не заведены —
 * браузеры при отсутствии PNG-иконок просто не показывают install-промпт,
 * что не ломает страницу. См. Docs/DEPLOY.md, раздел «PWA».
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'UX42 Studio',
        short_name: 'UX42',
        description:
            'Product design studio — portfolios, case studies and design resources.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#F7FAF5',
        theme_color: '#0B6E4F',
        lang: 'en',
        dir: 'ltr',
        categories: ['design', 'portfolio', 'business'],
        icons: [
            {
                src: '/icon.png',
                sizes: '634x634',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/og/og-cover.png',
                sizes: '1200x630',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
