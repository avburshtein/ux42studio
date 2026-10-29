-- Кастомные заголовки секций кейса (D-009): пользователь может переименовать
-- любую секцию под свой кейс. Nullable: NULL → дефолтный заголовок из кода
-- кейс-страницы (обратно совместимо с существующими проектами).
ALTER TABLE `projects` ADD `problem_title` text;
--> statement-breakpoint
ALTER TABLE `projects` ADD `research_title` text;
--> statement-breakpoint
ALTER TABLE `projects` ADD `design_process_title` text;
--> statement-breakpoint
ALTER TABLE `projects` ADD `design_system_title` text;
--> statement-breakpoint
ALTER TABLE `projects` ADD `testing_title` text;
--> statement-breakpoint
ALTER TABLE `projects` ADD `final_design_title` text;
--> statement-breakpoint
ALTER TABLE `projects` ADD `reflection_title` text;
