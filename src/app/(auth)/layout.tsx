import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import { ThemeToggle } from '@/components/case/ThemeToggle';
import { LangSwitch } from '@/components/LangSwitch';

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
            className='flex min-h-screen flex-col bg-[var(--md-sys-color-surface)]'
        >
            {/* Верхняя строка — в section-container, как хедер главной
                (фидбэк 2026-11-17): кнопки «назад» и тема были fixed
                left-4/right-4 к краям экрана и висели мимо сетки. Теперь
                их края совпадают с краями контента (pads 24/48/64). */}
            <div className='section-container flex w-full items-center justify-between py-4'>
                {/* «Назад»: экраны /login, /register, /forgot-password и
                    /reset-password — тупиковые, без выхода кроме стрелок
                    браузера (фидбэк 2026-10-26). Настоящий шаг назад по
                    истории; с внешнего сайта/прямой ссылки — на главную.
                    Иконка без текста: подпись только для скринридера */}
                <BackButton
                    fallbackHref='/'
                    iconSize={24}
                    className='inline-flex h-12 w-12 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-150 ease-out hover:text-primary'
                >
                    <span className='sr-only'>Назад</span>
                </BackButton>
                <div className='flex items-center gap-4'>
                    {/* Переключатель ru/en — как в админке: тот же cookie
                        admin_lang, выбор сохранится для админ-интерфейса */}
                    <LangSwitch />
                    {/* Переключатель темы — 48×48, спека §74,
                        WCAG 2.5.5 Target Size (AAA) */}
                    <ThemeToggle />
                </div>
            </div>
            <div className='flex flex-1 items-center justify-center'>
                <main className='w-full max-w-md p-8'>{children}</main>
            </div>
        </div>
    );
}
