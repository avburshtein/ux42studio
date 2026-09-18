import type { Metadata } from 'next';
import { ThemeToggle } from '@/components/case/ThemeToggle';

// C4 (решение (42)): приватная зона auth (/login, /register) — noindex/
// nofollow (robots.txt уже закрывает пути; meta — второй рубеж).
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--md-sys-color-surface)]'>
            {/* Переключатель темы — и на экране входа/регистрации.
                48×48 — спека §74, WCAG 2.5.5 Target Size (AAA) */}
            <div className='fixed right-4 top-4'>
                <ThemeToggle />
            </div>
            <main className='w-full max-w-md p-8'>{children}</main>
        </div>
    );
}
