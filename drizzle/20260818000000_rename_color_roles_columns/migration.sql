-- Ренейминг колонок colorRoles: name → name1, slug → name2
ALTER TABLE `color_roles` RENAME COLUMN `name` TO `name1`;
ALTER TABLE `color_roles` RENAME COLUMN `slug` TO `name2`;

-- Удаляем старый уникальный индекс и создаём новый
DROP INDEX IF EXISTS `idx_color_roles_project_slug`;
CREATE UNIQUE INDEX `idx_color_roles_project_name2` ON `color_roles` (`project_id`,`name2`);