-- Очистка таблиц перед сидингом
DELETE FROM project_color_roles;
DELETE FROM project_categories;
DELETE FROM project_assets;
DELETE FROM project_items;
DELETE FROM project_key_metrics;
DELETE FROM projects;
DELETE FROM categories;
DELETE FROM color_roles;
DELETE FROM profiles;
DELETE FROM users;

-- 1. Пользователь и Профиль
INSERT INTO users (id, email, password_hash, role, is_active) 
VALUES ('usr_admin_01', 'den.zakh@gmail.com', 'demo_hash_placeholder', 'admin', 1);

INSERT INTO profiles (id, user_id, slug, full_name, headline, bio, location, website, is_public) 
VALUES (
  'prf_denis_01', 
  'usr_admin_01', 
  'denis-zakharchenko', 
  'Denis Zakharchenko', 
  'Frontend Architect & MedTech Lead', 
  'Senior Software Engineer specializing in complex MedTech & B2B Web Applications.', 
  'Spain', 
  'https://ux42.studio', 
  1
);

-- 2. Категории
INSERT INTO categories (id, name, slug, "order") VALUES 
('cat_medtech', 'MedTech & Healthcare', 'medtech', 1),
('cat_b2b', 'B2B Platforms', 'b2b', 2),
('cat_architecture', 'System Architecture', 'architecture', 3);

-- 3. Цветовые роли
INSERT INTO color_roles (id, name, slug, light_color1, light_color2, dark_color1, dark_color2, light_contrast_ratio, dark_contrast_ratio) 
VALUES 
('clr_primary', 'Primary Accent', 'primary-accent', '#0066FF', '#0052CC', '#3385FF', '#66A3FF', 4.5, 7.1),
('clr_accent', 'Teal Highlight', 'teal-highlight', '#00B894', '#00A383', '#55EFC4', '#00B894', 3.8, 8.2);

-- 4. Проекты
INSERT INTO projects (id, profile_id, slug, title, teaser, client, year, duration, my_role, status, show_on_homepage) 
VALUES 
(
  'prj_clinical_01', 
  'prf_denis_01', 
  'clinical-workflow-automation', 
  'Clinical Workflow Automation System', 
  'Quadrupled clinician throughput by streamlining medical record processing.', 
  'Bekhterev National Research Medical Center', 
  2024, 
  '12 months', 
  'Lead Architect & Frontend Developer', 
  'published', 
  1
),
(
  'prj_b2b_dashboard', 
  'prf_denis_01', 
  'b2b-marketplace-analytics', 
  'High-Load B2B Marketplace Analytics', 
  'Interactive dashboard suite with interdependent data structures.', 
  'LLC Olkurs', 
  2025, 
  '8 months', 
  'Lead Frontend Engineer', 
  'published', 
  1
);

-- 5. Связи проектов с категориями
INSERT INTO project_categories (project_id, category_id) VALUES 
('prj_clinical_01', 'cat_medtech'),
('prj_clinical_01', 'cat_architecture'),
('prj_b2b_dashboard', 'cat_b2b');