'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/case/ThemeToggle';

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

    return (
        <div className='admin-layout min-h-screen bg-surface'>
            <header className='border-b border-outline-variant bg-surface'>
                <div className='mx-auto max-w-7xl px-8'>
                    <div className='flex items-center justify-between py-3'>
                        <div className='flex items-center gap-6'>
                            <div className='text-title-md text-on-surface font-semibold'>
                                Admin
                            </div>
                            <nav className='flex gap-1 mr-4'>
                                {isSuperAdmin && (
                                    <Link
                                        href='/super-admin'
                                        className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                    >
                                        Суперадминка
                                    </Link>
                                )}
                                <Link
                                    href='/admin'
                                    className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    Ред. проекты
                                </Link>
                                <Link
                                    href='/admin/profile'
                                    className='whitespace-nowrap rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    Редактировать страницу сайта
                                </Link>
                                <Link
                                    href='/admin/settings'
                                    className='whitespace-nowrap rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    Настройки профиля
                                </Link>
                                {profileSlug && (
                                    <Link
                                        href={`/u/${profileSlug}`}
                                        className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                    >
                                        Мой сайт
                                    </Link>
                                )}
                                <Link
                                    href='/help'
                                    className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    Справка
                                </Link>
                            </nav>
                        </div>
                        <div className='flex items-center gap-2'>
                            {/* Переключатель темы доступен на всех шагах
                                админки (ThemeProvider — в корневом layout).
                                Размер 48×48 — по спеке (§74) и WCAG 2.5.5
                                Target Size (AAA, 44px min); Material 3 = 48 */}
                            <ThemeToggle />
                            <form action={logout}>
                                <button
                                    type='submit'
                                    className='inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    <LogOut className='h-4 w-4' />
                                    Выйти
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
            <div className='mx-auto max-w-7xl p-8'>{children}</div>
        </div>
    );
}
