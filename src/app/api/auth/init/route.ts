import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema/users';
import { sql } from 'drizzle-orm';
import { signJwt } from '@/lib/jwt';
import { hashPassword } from '@/lib/crypto';

export async function POST() {
    try {
        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        // 1. Проверить, есть ли хоть один пользователь
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(users);
        const count = result[0]?.count ?? 0;

        if (count > 0) {
            return NextResponse.json(
                { error: 'Init already completed' },
                { status: 403 },
            );
        }

        // 2. Проверить переменные окружения
        const adminEmail = env.ADMIN_EMAIL || process.env.ADMIN_EMAIL;
        const adminPassword = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return NextResponse.json(
                { error: 'ADMIN_EMAIL and ADMIN_PASSWORD must be set' },
                { status: 500 },
            );
        }

        // 3. Создать суперадмина
        const id = crypto.randomUUID();
        const passwordHash = await hashPassword(adminPassword);

        await db.insert(users).values({
            id,
            email: adminEmail,
            passwordHash,
            role: 'admin',
        });

        // 4. Создать JWT
        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json(
                { error: 'JWT_SECRET is not configured' },
                { status: 500 },
            );
        }

        const token = await signJwt(
            { userId: id, email: adminEmail, role: 'admin' },
            jwtSecret,
        );

        // 5. Установить куку
        const maxAge = 60 * 60 * 24 * 7; // 7 дней
        const res = NextResponse.json({ ok: true });
        res.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge,
        });

        return res;
    } catch (err) {
        console.error('Init error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
