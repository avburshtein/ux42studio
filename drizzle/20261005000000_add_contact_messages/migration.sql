-- contact_messages: обращения из публичной формы обратной связи (Contact us).
--
-- Две задачи одной таблицы:
--   1. Rate limit — не больше 3 обращений в час с одного IP. Без него
--      форма становится бесплатным релеем: письма уходят с домена сайта,
--      и злоупотребление бьёт по репутации домена.
--   2. Журнал отправленного — статус и messageId провайдера, чтобы
--      неудачная доставка не оставалась незамеченной.
--
-- Текст сообщения здесь НЕ хранится (обрабатывается только в письме —
-- минимальный след персональных данных). Сырой IP тоже не хранится:
-- только salted SHA-256 (см. src/lib/actions/contact.ts), и только
-- последние 7 дней — старые строки удаляются при каждой отправке.
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL DEFAULT (unixepoch()),
	`ip_hash` text NOT NULL,
	`email` text NOT NULL,
	`to_email` text NOT NULL,
	`profile_id` text,
	`status` text NOT NULL,
	`message_id` text
);
--> statement-breakpoint
CREATE INDEX `contact_messages_ip_created_idx` ON `contact_messages` (`ip_hash`,`created_at`);
