import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { verifyJwt } from '@/lib/jwt';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

interface AuthBarProps {
    /** userId владельца профиля/проекта — для проверки, является ли текущий юзер владельцем */
    profileUserId?: string;
    /** id проекта для ссылки на редактирование */
    projectId?: string;
}

export default async function AuthBar({
    profileUserId,
    projectId,
}: AuthBarProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return null;

    const payload = await verifyJwt(token, jwtSecret);
    if (!payload) {
        return (
            <div className='fixed top-4 right-4 z-50'>
                <Link
                    href='/login'
                    // Те же требования a11y, что и в ветке выше: 44×44
                    // и текстовый токен вместо opacity-20.
                    className='inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-150 ease-out hover:bg-surface-variant hover:text-primary'
                    title='Войти'
                    aria-label='Войти'
                >
                    <LogIn className='w-4 h-4' aria-hidden />
                </Link>
            </div>
        );
    }

    const { userId, role } = payload as { userId: string; role: string };
    const isSuperAdmin = role === 'admin';
    const isOwner = profileUserId ? userId === profileUserId : false;

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { slug: true },
    });

    return (
        <div className='bg-surface-variant/60 border-b border-outline-variant'>
            <div className='mx-auto w-full max-w-container-content'>
                <div className='px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-end gap-3'>
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
                        Админка
                    </Link>

                    {profile?.slug && (
                        <Link
                            href={`/u/${profile.slug}`}
                            className='text-label-sm text-on-surface-variant hover:text-on-surface transition-colors'
                        >
                            Мой профиль
                        </Link>
                    )}
                    {isOwner && projectId && (
                        <Link
                            href={`/admin/projects/${projectId}/edit/general`}
                            // C2: класс hover:text-primary-variant ссылался на
                            // несуществующий токен → hover просто не срабатывал.
                            // Временно приглушение вместо цвета; как только
                            // придёт реальный primary-variant из Figma —
                            // вернуть hover:text-primary-variant.
                            className='text-label-sm text-primary hover:opacity-80 transition-opacity font-medium'
                        >
                            Редактировать проект
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
