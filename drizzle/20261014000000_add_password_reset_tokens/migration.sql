-- password_reset_tokens: одноразовые токены самостоятельного сброса пароля
-- (кнопка «Забыли пароль?» на /login).
--
-- Безопасность:
--   * в БД хранится только SHA-256 от токена (как пароли — необратимо):
--     утечка дампа не даёт рабочих ссылок сброса;
--   * токен одноразовый (used_at) и живёт 1 час (expires_at);
--   * новый запрос сброса инвалидирует прежние неиспользованные токены юзера;
--   * не больше 3 писем в час на аккаунт (rate limit в экшне).
CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer NOT NULL DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `prt_user_created_idx` ON `password_reset_tokens` (`user_id`,`created_at`);
--> statement-breakpoint
CREATE UNIQUE INDEX `prt_token_hash_idx` ON `password_reset_tokens` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `prt_user_expires_idx` ON `password_reset_tokens` (`user_id`,`expires_at`);