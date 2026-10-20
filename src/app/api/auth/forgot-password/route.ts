import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, passwordResetTokens } from '@/db/schema';
import { and, eq, gt, lt, sql } from 'drizzle-orm';
import { sendPasswordResetEmail, resolveAppUrl } from '@/lib/email/send';

/** Окно rate limit: не больше RESETS_PER_WINDOW писем на аккаунт за час. */
const RESETS_PER_WINDOW = 3;
const TOKEN_TTL_SECONDS = 60 * 60;

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as Record<
            string,
            string
        >;
        const email = (body.email || '').trim();
        if (!email) {
            return NextResponse.json(
                { message: 'Missing fields' },
                { status: 400 },
            );
        }

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);
        const now = Math.floor(Date.now() / 1000);

        // Дежурная чистка: просроченные токены удаляются при любом запросе
        await db
            .delete(passwordResetTokens)
            .where(lt(passwordResetTokens.expiresAt, now));

        // Поиск пользователя без учёта регистра (в БД email может быть
        // сохранён с заглавных — «Av.burshtein@gmail.com»)
        const [user] = await db
            .select()
            .from(users)
            .where(sql`lower(${users.email}) = ${email.toLowerCase()}`)
            .limit(1);

        if (user && user.isActive) {
            // Rate limit: считаем токены, созданные за последний час
            const recent = await db
                .select({ id: passwordResetTokens.id })
                .from(passwordResetTokens)
                .where(
                    and(
                        eq(passwordResetTokens.userId, user.id),
                        gt(passwordResetTokens.createdAt, now - 60 * 60),
                    ),
                );

            if (recent.length < RESETS_PER_WINDOW) {
                // Одноразовый токен: в БД — только SHA-256, сырой — в письме
                const raw = Array.from(
                    crypto.getRandomValues(new Uint8Array(32)),
                )
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');
                const tokenHash = await sha256Hex(raw);
                const expiresAt = now + TOKEN_TTL_SECONDS;

                await db.insert(passwordResetTokens).values({
                    id: crypto.randomUUID(),
                    userId: user.id,
                    tokenHash,
                    expiresAt,
                });

                // Прежние неиспользованные ссылки гасим — работает последняя
                const [current] = await db
                    .select({ id: passwordResetTokens.id })
                    .from(passwordResetTokens)
                    .where(eq(passwordResetTokens.tokenHash, tokenHash));
                await db
                    .update(passwordResetTokens)
                    .set({ usedAt: now })
                    .where(
                        and(
                            eq(passwordResetTokens.userId, user.id),
                            sql`${passwordResetTokens.usedAt} IS NULL`,
                            sql`${passwordResetTokens.id} <> ${current?.id ?? ''}`,
                        ),
                    );

                const appUrl = resolveAppUrl(env, req.headers.get('host'));
                await sendPasswordResetEmail({
                    toEmail: user.email,
                    resetUrl: `${appUrl}/reset-password?token=${raw}`,
                    expiresAt,
                });
            }
            // Превышен лимит — отвечаем так же, как при успехе: не раскрываем
            // существование аккаунта и лимитов
        }

        // Ответ всегда одинаковый: не раскрываем, существует ли email
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
