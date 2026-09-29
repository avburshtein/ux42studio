import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ux42.studio'),
    // Шаблон заголовка: страницы задают title целиком («Legal Notice & Terms
    // of Use — UX42 Studio»), дефолт собирает «<page> — UX42 Studio».
    title: {
        default: 'UX42 Studio',
        template: '%s — UX42 Studio',
    },
    applicationName: 'UX42 Studio',
    authors: [{ name: 'Aleksandra Burshtein' }],
    creator: 'UX42 Studio',
    description: 'Product design studio — we help teams ship clear, human interfaces.',
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        siteName: 'UX42 Studio',
        locale: 'en_US',
        url: '/',
        title: 'UX42 Studio',
        description: 'Product design studio — we help teams ship clear, human interfaces.',
        images: [
            {
                url: '/og/og-cover.png',
                width: 1200,
                height: 630,
                alt: 'UX42 Studio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'UX42 Studio',
        description: 'Product design studio — we help teams ship clear, human interfaces.',
        images: ['/og/og-cover.png'],
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // lang='en': публичный контент сайта английский (EN — основной язык
        // /u/[slug], /privacy, /terms). Было 'ru' — конфликт с lang скринридера
        // и с поисковыми системами (WCAG 3.1.1 Language of Page).
        // Русские фрагменты (формы /login, /register) помечены lang="ru" ниже.
        <html
            lang='en'
            suppressHydrationWarning
            className={`${poppins.variable} ${inter.variable}`}
        >
            <head>
                {/* Фавикон — file-convention src/app/icon.png: Next сам
                    вставляет <link rel="icon">. Ручная ссылка на /favicon.svg
                    удалена — файла в public/ не было, битый 404
                    (C1, решение (43)). Старый icon.svg заменён на PNG
                    634×634 из public/ («favicon UX42.png»). */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);return}if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
                    }}
                />
            </head>
            <body className='antialiased'>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
