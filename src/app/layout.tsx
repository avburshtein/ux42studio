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
    title: 'UX42 Studio',
    description: 'Portfolio management platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='ru' suppressHydrationWarning>
            <head>
                <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
            </head>
            <body
                className={`${poppins.variable} ${inter.variable} antialiased`}
            >
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
