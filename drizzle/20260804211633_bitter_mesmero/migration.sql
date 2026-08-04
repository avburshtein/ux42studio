CREATE TABLE `invites` (
	`id` text PRIMARY KEY,
	`code` text NOT NULL UNIQUE,
	`email` text,
	`created_by_user_id` text NOT NULL,
	`used_by_user_id` text,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_invites_created_by_user_id_users_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_invites_used_by_user_id_users_id_fk` FOREIGN KEY (`used_by_user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`email` text NOT NULL UNIQUE,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL UNIQUE,
	`slug` text NOT NULL UNIQUE,
	`full_name` text NOT NULL,
	`headline` text,
	`bio` text,
	`avatar_file_id` text,
	`cover_file_id` text,
	`location` text,
	`website` text,
	`is_public` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_profiles_avatar_file_id_files_id_fk` FOREIGN KEY (`avatar_file_id`) REFERENCES `files`(`id`),
	CONSTRAINT `fk_profiles_cover_file_id_files_id_fk` FOREIGN KEY (`cover_file_id`) REFERENCES `files`(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` text PRIMARY KEY,
	`profile_id` text NOT NULL,
	`platform` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_social_links_profile_id_profiles_id_fk` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY,
	`uploader_id` text NOT NULL,
	`r2_key` text NOT NULL UNIQUE,
	`file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_files_uploader_id_users_id_fk` FOREIGN KEY (`uploader_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_assets` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`file_id` text NOT NULL,
	`asset_type` text NOT NULL,
	`caption` text,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_project_assets_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_project_assets_file_id_files_id_fk` FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `project_categories` (
	`project_id` text NOT NULL,
	`category_id` text NOT NULL,
	CONSTRAINT `project_categories_pk` PRIMARY KEY(`project_id`, `category_id`),
	CONSTRAINT `fk_project_categories_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_project_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY,
	`profile_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`teaser` text,
	`client` text,
	`year` integer,
	`duration` text,
	`my_role` text,
	`constraints` text,
	`devices` text,
	`tags` text,
	`cover_file_id` text,
	`figma_prototype_url` text,
	`web_prototype_url` text,
	`gallery_description` text,
	`problem_statement` text,
	`project_goal` text,
	`target_users` text,
	`research_methodology` text,
	`user_story` text,
	`visual_direction` text,
	`display_font` text,
	`body_font` text,
	`design_approach` text,
	`testing_process` text,
	`final_description` text,
	`key_takeaway` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`show_on_homepage` integer DEFAULT 1 NOT NULL,
	`views_count` integer DEFAULT 0 NOT NULL,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_projects_profile_id_profiles_id_fk` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_projects_cover_file_id_files_id_fk` FOREIGN KEY (`cover_file_id`) REFERENCES `files`(`id`)
);
--> statement-breakpoint
CREATE TABLE `color_roles` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`light_color1` text NOT NULL,
	`light_color2` text NOT NULL,
	`dark_color1` text NOT NULL,
	`dark_color2` text NOT NULL,
	`light_contrast_ratio` real,
	`dark_contrast_ratio` real,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_color_roles` (
	`project_id` text NOT NULL,
	`role_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `project_color_roles_pk` PRIMARY KEY(`project_id`, `role_id`),
	CONSTRAINT `fk_project_color_roles_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_project_color_roles_role_id_color_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `color_roles`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `project_comparisons` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`feature_name` text NOT NULL,
	`before_file_id` text,
	`after_file_id` text,
	`before_text` text,
	`after_text` text,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_project_comparisons_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_project_comparisons_before_file_id_files_id_fk` FOREIGN KEY (`before_file_id`) REFERENCES `files`(`id`),
	CONSTRAINT `fk_project_comparisons_after_file_id_files_id_fk` FOREIGN KEY (`after_file_id`) REFERENCES `files`(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_items` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_project_items_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `project_key_metrics` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`value` text NOT NULL,
	`description` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_project_key_metrics_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `project_personas` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`name_and_age` text NOT NULL,
	`avatar_file_id` text,
	`bio` text NOT NULL,
	`pain_points` text NOT NULL,
	CONSTRAINT `fk_project_personas_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_project_personas_avatar_file_id_files_id_fk` FOREIGN KEY (`avatar_file_id`) REFERENCES `files`(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_reviews` (
	`id` text PRIMARY KEY,
	`project_id` text NOT NULL,
	`text` text NOT NULL,
	`author_name` text NOT NULL,
	`author_role` text,
	`avatar_file_id` text,
	`order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_project_reviews_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_project_reviews_avatar_file_id_files_id_fk` FOREIGN KEY (`avatar_file_id`) REFERENCES `files`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_projects_profile_slug` ON `projects` (`profile_id`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_projects_home` ON `projects` (`status`,`show_on_homepage`,`created_at`);