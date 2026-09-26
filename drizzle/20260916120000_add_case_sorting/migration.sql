-- case_sorting: порядок кейсов в галерее дизайнера (решение 2026-09-16,
-- панель CaseSortManager в /admin).
-- projects.sort_order — Manual-порядок (asc: меньше = выше в списке).
-- profiles.case_sort_mode — 'manual' | 'newest' | 'oldest' | 'alpha_asc' |
-- 'alpha_desc'; NULL = 'newest' (историческое поведение, по published_at).
ALTER TABLE `projects` ADD `sort_order` integer NOT NULL DEFAULT 0;
ALTER TABLE `profiles` ADD `case_sort_mode` text;

-- Backfill sort_order = текущая выдача («сначала новые»): ранг по
-- COALESCE(published_at, created_at) DESC внутри профиля; tie-breaker
-- по id — детерминированно. Новейший кейс получает 0.
UPDATE `projects`
SET `sort_order` = (
    SELECT COUNT(*) FROM `projects` AS p2
    WHERE p2.`profile_id` = `projects`.`profile_id`
      AND (COALESCE(p2.`published_at`, p2.`created_at`), p2.`id`) >
          (COALESCE(`projects`.`published_at`, `projects`.`created_at`), `projects`.`id`)
);