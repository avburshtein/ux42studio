import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Обращения из публичной формы обратной связи.
 *
 * Таблица закрывает две задачи сразу:
 *
 *  1. **Rate limit** — не больше 3 обращений с одного IP за час. Без этого
 *     форма становится бесплатным релеем для спама: отправка идёт с домена
 *     сайта, и злоупотребление попадает в репутацию домена.
 *  2. **Журнал отправленного** — письмо уходит через Resend/Cloudflare, и
 *     если доставка не удалась, об этом остаётся хотя бы запись со статусом.
 *
 * Текст сообщения здесь **не хранится** — обрабатывается в письме и больше
 * нигде: минимальный след персональных данных (privacy by design). Сырой IP
 * тоже не хранится: только salted SHA-256 (псевдонимизация, GDPR), и только
 * за последние 7 дней — старые строки удаляются при каждой новой отправке.
 */
export const contactMessages = sqliteTable(
    'contact_messages',
    {
        id: text('id').primaryKey(),
        /** Unix-секунды (модель времени остальных таблиц проекта). */
        createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
        /** SHA-256(salt + ip) — по нему считается лимит, сырой IP не нужен. */
        ipHash: text('ip_hash').notNull(),
        /** Обратный адрес посетителя (для Reply-To). */
        email: text('email').notNull(),
        /** Куда доставлено: hello@ или адрес дизайнера со страницы. */
        toEmail: text('to_email').notNull(),
        /** Чья страница была источником обращения; null — главная/платформа. */
        profileId: text('profile_id'),
        /** `sent` — транспорт принял письмо; `failed` — ошибка отправки. */
        status: text('status', { enum: ['sent', 'failed'] }).notNull(),
        /** Идентификатор письма у почтового провайдера (для трассировки). */
        messageId: text('message_id'),
    },
    (table) => [index('contact_messages_ip_created_idx').on(table.ipHash, table.createdAt)],
);
