-- sections_visibility: JSON-карта видимости секций кейса (sectionKey → boolean).
-- Отсутствующий ключ = секция показывается при наличии данных.
ALTER TABLE `projects` ADD `sections_visibility` text;
