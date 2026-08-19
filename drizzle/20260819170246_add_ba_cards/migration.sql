CREATE TABLE `ba_cards` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`feature_name` text NOT NULL,
	`before_text` text NOT NULL,
	`after_text` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_ba_cards_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);
