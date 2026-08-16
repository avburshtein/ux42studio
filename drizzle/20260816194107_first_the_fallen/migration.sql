PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_color_roles` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`light_color1` text NOT NULL,
	`light_color2` text NOT NULL,
	`dark_color1` text NOT NULL,
	`dark_color2` text NOT NULL,
	`light_contrast_ratio` real,
	`dark_contrast_ratio` real,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_color_roles_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);
DROP TABLE `color_roles`;
ALTER TABLE `__new_color_roles` RENAME TO `color_roles`;
PRAGMA foreign_keys=ON;
CREATE UNIQUE INDEX `idx_color_roles_project_slug` ON `color_roles` (`project_id`,`slug`);
DROP TABLE `project_color_roles`;