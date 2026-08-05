import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, invites } from '@/db/schema/users';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, invite } = body || {};
        if (!email || !invite)
            return NextResponse.json(
                { message: 'Missing fields' },
                { status: 400 },
            );

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        // Find invite
        const inv = await db.query.invites.findFirst({
            where: (i, { eq }) => eq(i.code, invite),
        });
        if (!inv)
            return NextResponse.json(
                { message: 'Неверный код инвайта' },
                { status: 400 },
            );
        if (inv.usedByUserId)
            return NextResponse.json(
                { message: 'Инвайт уже использован' },
                { status: 400 },
            );

        // Check existing user
        const exists = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, email),
        });
        if (exists)
            return NextResponse.json(
                { message: 'Пользователь с таким email уже существует' },
                { status: 400 },
            );

        const arr = new Uint8Array(10);
        crypto.getRandomValues(arr);
        const password = Array.from(arr)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
            .slice(0, 20);
        const passwordHash = await bcrypt.hash(password, 10);
        const id = crypto.randomUUID();

        await db.insert(users).values({ id, email, passwordHash });
        await db
            .update(invites)
            .set({ usedByUserId: id })
            .where((c, { eq }) => eq(c.id, inv.id));

        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error('JWT_SECRET is not configured');
        const payload = { userId: id, email, role: 'user' };
        const token = await signJwt(payload, jwtSecret);
        const maxAge = 60 * 60 * 24 * 7;

        const res = NextResponse.json({ ok: true, password });
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
