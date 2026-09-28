import { getCloudflareContext } from '@opennextjs/cloudflare';
import {
    buildInviteEmail,
    buildRegisteredEmail,
    type InviteEmailData,
} from './templates';

/**
 * Отправка писем с инвайтами.
 *
 * Транспорт выбирается автоматически, по тому, что настроено в проекте:
 *
 *  1. Cloudflare Email Service — биндинг `send_email` (EMAIL в wrangler.toml).
 *     Требует тариф Workers Paid (3 000 писем/мес включено, дальше $0.35/1000)
 *     и подключённого домена: `npx wrangler email sending enable ux42.studio`.
 *  2. Resend — обычный HTTP-запрос по переменной RESEND_API_KEY. Работает
 *     на любом тарифе Cloudflare, бесплатный лимит Resend: 3 000 писем/мес.
 *
 * Если не настроено ни то, ни другое — письмо не отправляется, инвайт всё
 * равно создаётся, а интерфейс показывает статус. Ошибка отправки НИКОГДА
 * не ломает создание инвайта: код в БД уже есть, письмо можно переслать
 * вручную.
 */

export type EmailProvider = 'cloudflare' | 'resend' | 'none';

export type EmailSendStatus = {
    /** `sent` — письмо принято транспортом; `not_configured` — отправка не настроена. */
    status: 'sent' | 'not_configured' | 'failed';
    provider: EmailProvider;
    messageId?: string;
    error?: string;
};

/** Структурный тип биндинга (глобальный `SendEmail` доступен только после typegen). */
type EmailBinding = {
    send(message: {
        to: string;
        from: string | { email: string; name?: string };
        subject: string;
        html?: string;
        text?: string;
        replyTo?: string;
    }): Promise<{ messageId: string }>;
};

type EmailEnv = {
    EMAIL?: EmailBinding;
    EMAIL_FROM?: string;
    EMAIL_FROM_NAME?: string;
    RESEND_API_KEY?: string;
    APP_URL?: string;
};

const NOT_CONFIGURED: EmailSendStatus = {
    status: 'not_configured',
    provider: 'none',
};

/** Адрес отправителя: явная настройка → вычисление из APP_URL. */
function resolveFrom(env: EmailEnv): { address: string; name: string } {
    const name = env.EMAIL_FROM_NAME?.trim() || 'UX42 Studio';
    const explicit = env.EMAIL_FROM?.trim();
    if (explicit) {
        // Поддержка формата «UX42 Studio <no-reply@ux42.studio>»
        const match = explicit.match(/<([^>]+)>/);
        const address = (match ? match[1] : explicit).trim();
        const inlineName = explicit.replace(/<[^>]+>/, '').trim();
        return { address, name: inlineName || name };
    }
    const host = env.APP_URL?.trim()
        ? env.APP_URL.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
        : 'ux42.studio';
    return { address: `no-reply@${host}`, name };
}

async function sendViaCloudflare(
    env: EmailEnv,
    params: { to: string; subject: string; html: string; text: string },
): Promise<EmailSendStatus> {
    const { address, name } = resolveFrom(env);
    const result = await env.EMAIL!.send({
        to: params.to,
        from: { email: address, name },
        subject: params.subject,
        html: params.html,
        text: params.text,
    });
    return { status: 'sent', provider: 'cloudflare', messageId: result.messageId };
}

async function sendViaResend(
    env: EmailEnv,
    params: { to: string; subject: string; html: string; text: string },
): Promise<EmailSendStatus> {
    const { address, name } = resolveFrom(env);
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: `${name} <${address}>`,
            to: [params.to],
            subject: params.subject,
            html: params.html,
            text: params.text,
        }),
        // Страховка от зависания: создание инвайта не должно ждать
        // внешний сервис дольше нескольких секунд.
        signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
        const body = await res.text().catch(() => '');
        return {
            status: 'failed',
            provider: 'resend',
            error: `Resend ${res.status}: ${body.slice(0, 200)}`,
        };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { status: 'sent', provider: 'resend', messageId: data.id };
}

/**
 * Отправляет письмо. Никогда не бросает исключений: вызывающий код
 * получает статус и сам решает, что показать пользователю.
 */
export async function sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
}): Promise<EmailSendStatus> {
    let env: EmailEnv;
    try {
        const { env: cfEnv } = await getCloudflareContext();
        env = (cfEnv ?? {}) as unknown as EmailEnv;
    } catch {
        return { ...NOT_CONFIGURED, error: 'Cloudflare context unavailable' };
    }

    const transport = env.EMAIL
        ? () => sendViaCloudflare(env, params)
        : env.RESEND_API_KEY
          ? () => sendViaResend(env, params)
          : null;

    if (!transport) return NOT_CONFIGURED;

    try {
        return await transport();
    } catch (e) {
        return {
            status: 'failed',
            provider: env.EMAIL ? 'cloudflare' : 'resend',
            error: e instanceof Error ? e.message : 'Unknown error',
        };
    }
}

/** Письмо-приглашение на регистрацию. */
export async function sendInviteEmail(
    data: InviteEmailData,
): Promise<EmailSendStatus> {
    const mail = buildInviteEmail(data);
    return sendEmail({ to: data.toEmail.trim(), ...mail });
}

/** Письмо «аккаунт создан» + план первых шагов. */
export async function sendRegisteredEmail(data: {
    toEmail: string;
    profileUrl: string;
    passwordUrl: string;
}): Promise<EmailSendStatus> {
    const mail = buildRegisteredEmail(data);
    return sendEmail({ to: data.toEmail.trim(), ...mail });
}

/**
 * Публичный адрес сайта для ссылок в письмах: APP_URL из переменных
 * окружения, иначе — хост текущего запроса.
 */
export function resolveAppUrl(
    env: { APP_URL?: string } | null,
    host?: string | null,
): string {
    const configured = env?.APP_URL?.trim();
    if (configured) return configured.replace(/\/+$/, '');
    if (host) return `https://${host}`;
    return 'https://ux42.studio';
}
