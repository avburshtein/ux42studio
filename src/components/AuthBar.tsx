'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

interface AuthBarProps {
    /** userId владельца профиля/проекта — для проверки, является ли текущий юзер владельцем */
    profileUserId?: string;
    /** id проекта для ссылки на редактирование */
    projectId?: string;
}

/** Ответ GET /api/session (лёгкий JSON: JWT + slug профиля). */
interface SessionResponse {
    authenticated: boolean;
    userId?: string;
    role?: string;
    profileSlug?: string | null;
}

type SessionState =
    | { status: 'loading' }
    | { status: 'guest' }
    | {
          status: 'auth';
          userId: string;
          role: string;
          profileSlug: string | null;
      };

/**
 * AuthBar — панель навигации авторизованного пользователя (или ссылка «Войти»).
 *
 * Был серверным компонентом (cookies() + verifyJwt + запрос в D1 на каждый
 * рендер) — это делало все маршруты с AuthBar (/, /platform, /u/[slug])
 * динамическими: SSR на каждый запрос, CPU воркера впустую.
 *
 * Теперь — клиентский:
 *  - дефолтный (статичный) рендер — ссылка «Войти» (ветка гостя, прежний
 *    вид для анонимных посетителей); после маунта лёгкий GET /api/session
 *    (JWT + slug профиля в JSON) подменяет её на панель ссылок админки
 *    для авторизованных;
 *  - панель видна только владельцам/админам — обычные посетители её не
 *    получат, поэтому задержка в ~50–100 мс незаметна (страница уже
 *    отрисована SSR/из кеша, панель — вспомогательный слой).
 */
export default function AuthBar({ profileUserId, projectId }: AuthBarProps) {
    const [session, setSession] = useState<SessionState>({ status: 'loading' });

    useEffect(() => {
        let cancelled = false;
        fetch('/api/session', { cache: 'no-store' })
            .then((res) => res.json() as Promise<SessionResponse>)
            .then((data) => {
                if (cancelled) return;
                if (data?.authenticated && data.userId && data.role) {
                    setSession({
                        status: 'auth',
                        userId: data.userId,
                        role: data.role,
                        profileSlug: data.profileSlug ?? null,
                    });
                } else {
                    setSession({ status: 'guest' });
                }
            })
            .catch(() => {
                if (!cancelled) setSession({ status: 'guest' });
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (session.status === 'loading' || session.status === 'guest') {
        return (
            <div className='absolute top-2 right-2 z-50'>
                <Link
                    href='/login'
                    // a11y: было w-8 h-8 opacity-10 — зона клика 32px и
                    // контраст ~0.1 (не виден; WCAG 2.5.8 + 1.4.11). Теперь
                    // 44×44 и токен on-surface-variant (8.87:1 в светлой,
                    // 10.90:1 в тёмной) — минимально проходимое значение;
                    // «спрятанность» сохранена размером, а не прозрачностью.
                    className='inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-150 ease-out hover:bg-surface-variant hover:text-primary'
                    title='Войти'
                    aria-label='Войти'
                >
                    <LogIn className='w-4 h-4' aria-hidden />
                </Link>
            </div>
        );
    }

    const { userId, role, profileSlug } = session;
    const isSuperAdmin = role === 'admin';
    const isOwner = profileUserId ? userId === profileUserId : false;

    return (
        // Один визуальный хедер с SiteHeader: тот же фон-стекло и тот же
        // section-container (max-w 1280 + pads 24/48/64), без разделительной
        // черты — полоса выглядит верхней строкой единой шапки.
        <div className='header-glass w-full backdrop-blur-md backdrop-saturate-[1.8]'>
            <div className='section-container flex w-full items-center justify-end gap-6 py-1.5'>
                {isSuperAdmin && (
                    <Link
                        href='/super-admin'
                        className='text-label-sm text-on-surface-variant hover:text-on-surface transition-colors'
                    >
                        Суперадминка
                    </Link>
                )}
                <Link
                    href='/admin'
                    className='text-label-sm text-on-surface-variant hover:text-on-surface transition-colors'
                >
                    Мой профиль
                </Link>

                {profileSlug && (
                    <Link
                        href='/admin/profile'
                        className='text-label-sm text-on-surface-variant hover:text-on-surface transition-colors'
                    >
                        Редактировать сайт
                    </Link>
                )}
                {isOwner && projectId && (
                    <Link
                        href={`/admin/projects/${projectId}/edit/general`}
                        // C2: hover:text-primary-variant — несуществующий
                        // токен (роли Primary Variant в M3 нет). Здесь
                        // state layer: приглушение в hover.
                        className='text-label-sm text-primary transition-opacity duration-150 ease-out hover:opacity-80 font-medium'
                    >
                        Редактировать проект
                    </Link>
                )}
            </div>
        </div>
    );
}
