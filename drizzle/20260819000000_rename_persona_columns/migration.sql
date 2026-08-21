-- Rename project_personas columns: bio → role, pain_points → description
-- Spec: Persona Card (176:372) — Name, Role, Description
ALTER TABLE `project_personas` RENAME COLUMN `bio` TO `role`;
ALTER TABLE `project_personas` RENAME COLUMN `pain_points` TO `description`;
