import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';
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
        // lang='ru': формы /login и /register — единственный русскоязычный
        // контент на сайте (остальное — EN/ES). Помечаем язык фрагмента, иначе
        // скринридер читает русский текст английским голосом (WCAG 3.1.1).
        <div
            lang='ru'
            className='min-h-screen flex items-center justify-center bg-[var(--md-sys-color-surface)]'
        >
            {/* Переключатель темы — и на экране входа/регистрации.
                48×48 — спека §74, WCAG 2.5.5 Target Size (AAA) */}
            <div className='fixed right-4 top-4'>
                <ThemeToggle />
            </div>
            {/* «Назад» зеркально переключателю темы: экраны /login, /register,
                /forgot-password и /reset-password — тупиковые, без выхода
                кроме стрелок браузера (фидбэк 2026-10-26). Настоящий шаг
                назад по истории; с внешнего сайта/прямой ссылки — на главную.
                Иконка без текста: подпись только для скринридера */}
            <BackButton
                fallbackHref='/'
                iconSize={24}
                className='fixed left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-150 ease-out hover:text-primary'
            >
                <span className='sr-only'>Назад</span>
            </BackButton>
            <main className='w-full max-w-md p-8'>{children}</main>
        </div>
    );
}
