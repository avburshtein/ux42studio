'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/case/ThemeToggle';
import {
    AdminLangProvider,
    AdminLangSwitch,
    useAdminLang,
} from '@/components/admin/AdminLang';

/** Ответ GET /api/session (тот же эндпоинт, что использует AuthBar). */
interface SessionResponse {
    authenticated: boolean;
    role?: string;
    profileSlug?: string | null;
}

/**
 * Клиентская оболочка админки (навигация + guard).
 *
 * Прежний admin/layout.tsx был серверным компонентом с headers() + двумя
 * запросами в D1 на КАЖДЫЙ запрос любой админ-страницы — это делало всю
 * ветку /admin/* динамической (SSR каждый раз), включая клиентские страницы
 * (profile, settings, редактор кейса), которые сами по себе статичны.
 *
 * Теперь layout — статический серверный компонент (только metadata), а
 * проверка сессии живёт здесь: GET /api/session после маунта; неавторизо-
 * ванных отправляет на /login (дублирует middleware — он уже редиректит
 * на edge). Роль («Суперадминка») и slug профиля («Мой сайт») приходят
 * из /api/session — без D1-запросов на рендер. Пока сессия проверяется,
 * рендерится статический shell; ссылки роли появляются через ~50–100 мс.
 */
export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminLangProvider>
            <AdminShellInner>{children}</AdminShellInner>
        </AdminLangProvider>
    );
}

function AdminShellInner({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useAdminLang();
    const router = useRouter();
    const [session, setSession] = useState<{
        role: string;
        profileSlug: string | null;
    } | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/session', { cache: 'no-store' })
            .then((res) => res.json() as Promise<SessionResponse>)
            .then((data) => {
                if (cancelled) return;
                if (data?.authenticated && data.role) {
                    setSession({
                        role: data.role,
                        profileSlug: data.profileSlug ?? null,
                    });
                } else {
                    router.replace('/login');
                }
            })
            .catch(() => {
                if (!cancelled) router.replace('/login');
            });
        return () => {
            cancelled = true;
        };
    }, [router]);

    const isSuperAdmin = session?.role === 'admin';
    const profileSlug = session?.profileSlug ?? null;
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Глобальная навигация: одна коллекция для десктоп-навигации и drawer
    const navLinks: Array<{ href: string; label: string }> = [
        ...(isSuperAdmin
            ? [{ href: '/super-admin', label: t('nav.superAdmin') }]
            : []),
        { href: '/admin', label: t('nav.projects') },
        { href: '/admin/profile', label: t('nav.profilePage') },
        { href: '/admin/settings', label: t('nav.settings') },
        ...(profileSlug
            ? [{ href: `/u/${profileSlug}`, label: t('nav.mySite') }]
            : []),
        { href: '/help', label: t('nav.help') },
    ];

    // Drawer закрывается при переходе, Escape и блокирует скролл фона
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [menuOpen]);

    return (
        <div className='admin-layout min-h-screen bg-surface'>
            {/* Моб. хедер: гамбургер + drawer (фидбэк 2026-10-26 — админка
                не адаптивна). Глассморфизм тот же, что у SiteHeader
                (header-glass + backdrop-blur). <lg — drawer, ≥lg — инлайн
                навигация (6 ссылок в строку не влезают в md). */}
            <header className='header-glass sticky top-0 z-40 border-b border-outline-variant backdrop-blur-md backdrop-saturate-[1.8]'>
                <div className='mx-auto max-w-7xl px-4 md:px-8'>
                    <div className='flex h-18 items-center justify-between'>
                        <div className='flex items-center gap-3 md:gap-6'>
                            <button
                                type='button'
                                onClick={() => setMenuOpen(true)}
                                aria-label={t('nav.openMenu')}
                                aria-expanded={menuOpen}
                                className='-ml-2 rounded-md p-2 text-on-surface hover:bg-surface-variant lg:hidden'
                            >
                                <Menu className='h-6 w-6' />
                            </button>
                            <div className='text-title-md font-semibold text-on-surface'>
                                Admin
                            </div>
                            <nav className='mr-4 hidden gap-1 lg:flex'>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className='whitespace-nowrap rounded-md px-3 py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface'
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className='flex items-center gap-2'>
                            {/* Переключатель темы доступен на всех шагах
                                админки (ThemeProvider — в корневом layout).
                                Размер 48×48 — по спеке (§74) и WCAG 2.5.5
                                Target Size (AAA, 44px min); Material 3 = 48 */}
                            <ThemeToggle />
                            <AdminLangSwitch />
                            {/* Выход на мобиле — в drawer (кнопка узкая) */}
                            <form action={logout} className='hidden lg:block'>
                                <button
                                    type='submit'
                                    className='inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    <LogOut className='h-4 w-4' />
                                    {t('nav.signOut')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
                {/* Drawer: затемнение + панель слева. Ссылки крупнее десктопа
                    (py-3, body-lg) — тач-таргеты ≥44px */}
                {menuOpen && (
                    <div
                        className='fixed inset-0 z-50 lg:hidden'
                        role='dialog'
                        aria-modal='true'
                        aria-label={t('nav.adminMenu')}
                    >
                        <div
                            className='absolute inset-0 bg-black/40'
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className='absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-outline-variant bg-surface shadow-2xl'>
                            <div className='flex items-center justify-between border-b border-outline-variant px-4 py-3'>
                                <span className='text-title-md font-semibold text-on-surface'>
                                    Admin
                                </span>
                                <button
                                    type='button'
                                    onClick={() => setMenuOpen(false)}
                                    aria-label={t('nav.closeMenu')}
                                    className='rounded-md p-2 text-on-surface hover:bg-surface-variant'
                                >
                                    <X className='h-6 w-6' />
                                </button>
                            </div>
                            <nav className='flex flex-col gap-1 p-2'>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`rounded-md px-3 py-3 text-body-lg ${
                                            pathname === link.href
                                                ? 'bg-primary-container font-medium text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <form
                                action={logout}
                                className='mt-auto border-t border-outline-variant p-2'
                            >
                                <button
                                    type='submit'
                                    className='flex w-full items-center gap-2 rounded-md px-3 py-3 text-body-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                                >
                                    <LogOut className='h-4 w-4' />
                                    {t('nav.signOut')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            <div className='mx-auto max-w-7xl p-4 md:p-8'>{children}</div>
        </div>
    );
}
