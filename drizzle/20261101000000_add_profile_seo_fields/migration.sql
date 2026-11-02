-- D-013: SEO-поля профиля — должность для <title> и описание для поисковиков.
-- До этого title собирался шаблоном «Имя — UX42 Studio», а description
-- дублировал headline (слоган). Теперь — отдельные поля:
--   job_title:         «UX/UI Designer & Design Engineer» → <title>/og:title
--   meta_description:  текст для сниппета, fallback — headline
ALTER TABLE profiles ADD COLUMN job_title TEXT;
ALTER TABLE profiles ADD COLUMN meta_description TEXT;
