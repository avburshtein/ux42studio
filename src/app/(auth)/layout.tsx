import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import { ThemeToggle } from '@/components/case/ThemeToggle';
// Тот же механизм языка, что в админке (D-012): провайдер даёт
// мгновенный перевод форм при клике, AdminLangSwitch пишет cookie
// admin_lang — выбор сохраняется и для админки (D-032).
import { AdminLangProvider, AdminLangSwitch } from '@/components/admin/AdminLang';

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
        // Атрибут lang='ru' — дефолт (SSR-рендер русскоязычен); при
        // переключении на EN контент меняется на клиенте, а атрибут
        // остаётся — компромисс: неверный lang хуже для скринридера,
        // чем отсутствие, но правка клиентского html[lang] тянет отдельный
        // механизм. Персчитать при следующем проходе по a11y.
        <AdminLangProvider>
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
                        {/* Переключатель ru/en — как в админке: контекстный,
                            перевод форм применяется мгновенно */}
                        <AdminLangSwitch />
                        {/* Переключатель темы — 48×48, спека §74,
                            WCAG 2.5.5 Target Size (AAA) */}
                        <ThemeToggle />
                    </div>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                    <main className='w-full max-w-md p-8'>{children}</main>
                </div>
            </div>
        </AdminLangProvider>
    );
}
