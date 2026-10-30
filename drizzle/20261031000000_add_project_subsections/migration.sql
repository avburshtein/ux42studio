-- D-011: Подразделы внутри секций кейса — кастомные блоки
-- «заголовок + многопараграфный текст» внутри любой секции кейс-страницы.
CREATE TABLE `project_subsections` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`section_key` text NOT NULL,
	`heading` text NOT NULL,
	`body` text,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_project_subsections_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `idx_project_subsections_project_key_order` ON `project_subsections` (`project_id`,`section_key`,`order`);