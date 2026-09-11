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
    title: 'UX42 Studio',
    description: 'Portfolio management platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='ru'
            suppressHydrationWarning
            className={`${poppins.variable} ${inter.variable}`}
        >
            <head>
                {/* Фавикон — file-convention src/app/icon.svg: Next сам вставляет
                    <link rel="icon">. Ручная ссылка на /favicon.svg удалена —
                    файла в public/ не было, битый 404 (C1, решение (43)). */}
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
