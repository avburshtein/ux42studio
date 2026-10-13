-- Характеристики шрифтовых пар (дизайнер не на M3-стандартах):
-- вес/размер/начертание свободной формой, например «Bold 64/72» или «Italic».
ALTER TABLE `projects` ADD `display_font_spec` text;
ALTER TABLE `projects` ADD `body_font_spec` text;