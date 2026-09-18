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
            {/* Переключатель темы — и на экране входа/регистрации */}
            <div className='fixed right-4 top-4'>
                <ThemeToggle className='h-10 w-10' />
            </div>
            <main className='w-full max-w-md p-8'>{children}</main>
        </div>
    );
}
