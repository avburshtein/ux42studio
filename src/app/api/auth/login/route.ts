import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema/users';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body || {};
        if (!email || !password)
            return NextResponse.json(
                { message: 'Missing credentials' },
                { status: 400 },
            );

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        const found = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, email),
        });
        if (!found)
            return NextResponse.json(
                { message: 'Неверный email или пароль' },
                { status: 401 },
            );

        const ok = await bcrypt.compare(password, found.passwordHash);
        if (!ok)
            return NextResponse.json(
                { message: 'Неверный email или пароль' },
                { status: 401 },
            );

        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error('JWT_SECRET is not configured');
        const payload = {
            userId: found.id,
            email: found.email,
            role: found.role,
        };
        const token = await signJwt(payload, jwtSecret);
        const maxAge = 60 * 60 * 24 * 7;

        const res = NextResponse.json({ ok: true });
        res.cookies.set('auth-token', token, {
            httpOnly: true,
            path: '/',
            maxAge,
        });
        return res;
    } catch (err) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
