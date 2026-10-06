'use server';

/**
 * Публичная форма обратной связи (модалка «Contact us»).
 *
 * Цепочка обработки:
 *   1. zod-валидация — схема общая с клиентом (`src/lib/contactForm.ts`),
 *      но сервер обязан проверять сам: клиентской валидации недостаточно;
 *   2. honeypot — непустое поле `website_url` означает бота: возвращаем
 *      «успех», но ничего не отправляем и не пишем в БД. Иначе бот
 *      понимает, что пойман, и меняет тактику;
 *   3. rate limit — 3 обращения в час с одного IP (таблица
 *      `contact_messages`, IP хэшируется с солью);
 *   4. резолв получателя: адрес дизайнера из его настроек или hello@.
 *      Адрес НЕ приходит с клиента — иначе форма превращается в открытое
 *      почтовое реле для спама;
 *   5. отправка (Resend / Cloudflare Email) + запись в журнал со статусом.
 *
 * Функция никогда не бросает исключений: посетитель всегда получает
 * понятный результат, а при ошибке отправки — адрес для прямого письма
 * (терять обращение нельзя).
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { headers } from 'next/headers';
import { and, count, eq, gt, lt } from 'drizzle-orm';
import { getDb } from '@/db';
import { contactMessages } from '@/db/schema/contact';
import { CONTACT_EMAIL } from '@/lib/contact';
import {
    CONTACT_HONEYPOT_FIELD,
    CONTACT_RATE_LIMIT,
    contactFormSchema,
    type ContactFormData,
} from '@/lib/contactForm';
import { buildContactEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/send';

export type ContactResult = { ok: true } | { ok: false; error: string };

type Db = ReturnType<typeof getDb>;

/** Соль псевдонимизации: голый SHA-256(IP) восстанавливается словарём. */
const IP_HASH_SALT = 'ux42.contact.v1';

/** Ретеншен журнала: старше 7 дней строка удаляется при следующей отправке. */
const RETENTION_SECONDS = 7 * 24 * 3600;

/** Простейшая проверка адреса — адрес приходит из настроек дизайнера. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashIp(ip: string): Promise<string> {
    const data = new TextEncoder().encode(`${IP_HASH_SALT}|${ip}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

async function getClientIp(): Promise<string> {
    const h = await headers();
    const cf = h.get('cf-connecting-ip');
    if (cf) return cf.trim();
    const fwd = h.get('x-forwarded-for');
    if (fwd) return fwd.split(',')[0]?.trim() || 'unknown';
    return 'unknown';
}

/** Куда доставлять: настроенный адрес дизайнера, иначе общий hello@. */
async function resolveRecipient(db: Db, profileId?: string): Promise<string> {
    if (!profileId) return CONTACT_EMAIL.hello;
    try {
        const profile = await db.query.profiles.findFirst({
            where: { id: profileId },
            columns: { mainPageContent: true },
        });
        const configured = profile?.mainPageContent?.cta?.emailAddress?.trim();
        if (configured && EMAIL_RE.test(configured)) return configured;
    } catch {
        // Проблема чтения — не повод отказывать, отвечаем на общий адрес.
    }
    return CONTACT_EMAIL.hello;
}

export async function sendContactMessage(
    input: ContactFormData,
    meta?: { source?: string; profileId?: string },
): Promise<ContactResult> {
    // 1. Валидация.
    const parsed = contactFormSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            error: parsed.error.issues[0]?.message ?? 'Please check the form fields.',
        };
    }
    const { name, email, message } = parsed.data;
    const honeypot = parsed.data[CONTACT_HONEYPOT_FIELD];

    // 2. Honeypot: молчаливый успех, никаких следов.
    if (honeypot?.trim()) {
        console.info('[contact] honeypot triggered — message dropped');
        return { ok: true };
    }

    try {
        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        // 3. Rate limit по IP.
        const ipHash = await hashIp(await getClientIp());
        const since = Math.floor(Date.now() / 1000) - CONTACT_RATE_LIMIT.windowSeconds;
        const recent = await db
            .select({ value: count() })
            .from(contactMessages)
            .where(
                and(
                    eq(contactMessages.ipHash, ipHash),
                    gt(contactMessages.createdAt, since),
                ),
            );
        if ((recent[0]?.value ?? 0) >= CONTACT_RATE_LIMIT.max) {
            return {
                ok: false,
                error: 'You have sent several messages in a row. Please wait a while, or email us directly.',
            };
        }

        // 4. Получатель (адрес берётся из БД, не с клиента).
        const to = await resolveRecipient(db, meta?.profileId);
        const source = (meta?.source ?? '').slice(0, 120);

        // 5. Отправка + журнал.
        const mail = buildContactEmail({ name, email, message, source });
        const sent = await sendEmail({ to, replyTo: email, ...mail });

        try {
            await db.insert(contactMessages).values({
                id: crypto.randomUUID(),
                ipHash,
                email,
                toEmail: to,
                profileId: meta?.profileId ?? null,
                status: sent.status === 'sent' ? 'sent' : 'failed',
                messageId: sent.messageId ?? null,
            });
            await db
                .delete(contactMessages)
                .where(
                    lt(
                        contactMessages.createdAt,
                        Math.floor(Date.now() / 1000) - RETENTION_SECONDS,
                    ),
                );
        } catch (e) {
            // Журнал — не повод терять письмо: отправка уже прошла.
            console.error('[contact] failed to record message', e);
        }

        if (sent.status !== 'sent') {
            console.warn('[contact] send failed', sent.provider, sent.error);
            return {
                ok: false,
                error: `Could not send your message right now. Please email us directly at ${CONTACT_EMAIL.hello}.`,
            };
        }
        return { ok: true };
    } catch (e) {
        console.error('[contact] unexpected error', e);
        return {
            ok: false,
            error: `Something went wrong. Please email us directly at ${CONTACT_EMAIL.hello}.`,
        };
    }
}
