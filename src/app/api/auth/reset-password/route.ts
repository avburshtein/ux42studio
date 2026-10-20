import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, passwordResetTokens } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { hashPassword } from '@/lib/crypto';

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as Record<
            string,
            string
        >;
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { message: 'Missing fields' },
                { status: 400 },
            );
        }
        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Пароль должен быть не короче 8 символов' },
                { status: 400 },
            );
        }

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);
        const now = Math.floor(Date.now() / 1000);

        // Токен ищем по хэшу: сырой токен в БД никогда не хранится
        const tokenHash = await sha256Hex(token);
        const entry = await db.query.passwordResetTokens.findFirst({
            where: { tokenHash },
        });

        if (
            !entry ||
            entry.usedAt !== null ||
            entry.expiresAt < now
        ) {
            return NextResponse.json(
                {
                    message:
                        'Ссылка недействительна или устарела. Запросите новую — она придёт в течение минуты.',
                },
                { status: 400 },
            );
        }

        // Новый пароль + отметка токена использованным. Остальные
        // неиспользованные ссылки этого аккаунта гасим тоже.
        const passwordHash = await hashPassword(password);
        await db
            .update(users)
            .set({ passwordHash, updatedAt: now })
            .where(eq(users.id, entry.userId));
        await db
            .update(passwordResetTokens)
            .set({ usedAt: now })
            .where(
                and(
                    eq(passwordResetTokens.userId, entry.userId),
                    sql`${passwordResetTokens.usedAt} IS NULL`,
                ),
            );

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

async function sha256Hex(value: string): Promise<string> {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(value),
    );
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}
