import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, invites } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { signJwt } from '@/lib/jwt';
import { hashPassword } from '@/lib/crypto';

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as Record<
            string,
            string
        >;
        const { email, invite } = body;

        if (!email || !invite) {
            return NextResponse.json(
                { message: 'Missing fields' },
                { status: 400 },
            );
        }

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        // 1. Поиск инвайта (Drizzle RQB v2)
        const inv = await db.query.invites.findFirst({
            where: {
                code: invite,
            },
        });

        if (!inv) {
            return NextResponse.json(
                { message: 'Неверный код инвайта' },
                { status: 400 },
            );
        }
        if (inv.usedByUserId) {
            return NextResponse.json(
                { message: 'Инвайт уже использован' },
                { status: 400 },
            );
        }

        // 2. Проверка пользователя (Drizzle RQB v2)
        const exists = await db.query.users.findFirst({
            where: {
                email,
            },
        });

        if (exists) {
            return NextResponse.json(
                { message: 'Пользователь с таким email уже существует' },
                { status: 400 },
            );
        }

        // 3. Генерация пароля и хеширование через Web Crypto API
        const arr = new Uint8Array(10);
        crypto.getRandomValues(arr);
        const password = Array.from(arr)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
            .slice(0, 20);

        const passwordHash = await hashPassword(password);
        const id = crypto.randomUUID();

        // 4. Запись в БД D1
        await db.insert(users).values({ id, email, passwordHash });
        await db
            .update(invites)
            .set({ usedByUserId: id })
            .where(eq(invites.id, inv.id));

        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error('JWT_SECRET is not configured');

        const payload = { userId: id, email, role: 'user' };
        const token = await signJwt(payload, jwtSecret);
        const maxAge = 60 * 60 * 24 * 7;

        const res = NextResponse.json({ ok: true, password });
        res.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge,
        });
        return res;
    } catch (err) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
