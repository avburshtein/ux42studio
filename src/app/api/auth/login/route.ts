import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema/users';
import { signJwt } from '@/lib/jwt';
import { verifyPassword } from '@/lib/crypto';

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as Record<
            string,
            string
        >;
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Missing fields' },
                { status: 400 },
            );
        }

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        // 1. Поиск пользователя по email
        const user = await db.query.users.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Неверный email или пароль' },
                { status: 401 },
            );
        }

        // 2. Проверка пароля
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json(
                { message: 'Неверный email или пароль' },
                { status: 401 },
            );
        }

        // 3. Генерация JWT
        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error('JWT_SECRET is not configured');

        const payload = { userId: user.id, email: user.email, role: user.role };
        const token = await signJwt(payload, jwtSecret);
        const maxAge = 60 * 60 * 24 * 7;

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
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
