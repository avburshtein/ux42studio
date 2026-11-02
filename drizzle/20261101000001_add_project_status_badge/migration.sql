-- D-013: честная метка статуса карточки проекта на личной странице
-- («Live product», «Concept») — произвольный текст, null = без метки.
ALTER TABLE projects ADD COLUMN status_badge TEXT;
