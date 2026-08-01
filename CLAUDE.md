В
# CLAUDE.md — UX42 Studio & Portfolio Platform (AI Router & Engineering Guidelines)

Ты — главный системный архитектор и разработчик проекта **UX42.studio**.
Архитектура проекта включает:

1. **Основной сайт студии (UX42.studio):** Презентация услуг студии («UX42.studio»), пакетов (Start & Go, Business Growth), услуг Vibe Coding и юридического комплаенса Испании (RGPD / EAA 2025).
2. **Мультиарендную платформу портфолио (UX42 Portfolios / SaaS-Engine):** Масштабируемую систему конструктора и конструктор формы кейсов (Case Template Engine) для авторов на поддоменах/роутах основного домена (`ux42.studio/[username]` или `[username].ux42.studio`).

---

## 📚 Навигация по документации (AI Router)

Перед сбокой, модификацией или генерацией кода обязательно читай релевантные инструкции (используй инструмент `read_file`):

1. **Дизайн-система и токены:** Читай `docs/design-system-ux42.md` и `UX42 Design System — Full Reference.pdf`.
2. **Правила Layout, Сетка и Компоненты:** Читай `docs/ui-rules.md`.
3. **Конструктор кейсов и Спецификация формы:** Читай `docs/case-template-spec.md` (на базе `case-template — Flow Description.pdf`).
4. **Юридический комплаенс (Испания/ЕС 2026):** Читай `docs/legal-and-compliance.md` (LSSI, RGPD, EAA 2025, VeriFactu).
5. **Стратегия, Роли и Команда:** Читай `docs/positioning-and-offers.md` и `УСТАВ КОМАНДЫ «DIGITAL CRAFTSMANSHIP»`.

---

## 🚫 СТРОГИЕ ПРАВИЛА И ОГРАНИЧЕНИЯ (ENGINEERING CONSTRAINTS)

* **ЗАПРЕЩЕНЫ** инлайн-стили (`style={{ ... }}`).
* **ЗАПРЕЩЕН** хардкод HEX-цветов (например `#0B6E4F`). Все цвета берутся строго из CSS-переменных темы (`var(--md-sys-color-primary)` и т.д.) или Tailwind-классов токенов.
* **ЗАПРЕЩЕНО** менять выравнивание и иерархию сетки layout shift (например, при появлении ошибок во введенных полях всегда резервируется helper text space).
* **Vibe Coding Protocol:** Вся верстка генерируется в виде чистого React + Tailwind CSS кода (через v0 / Cursor). Избегать избыточных оберток (overcoding).

---

## 🎨 ТЕХНОЛОГИЧЕСКИЙ СТЕК И ДИЗАЙН-СИСТЕМА

### Стек:

* **Framework:** Next.js (App Router), React 19.
* **Styling:** Tailwind CSS v4 + Material Design 3 (Material You Tokens).
* **Icons:** `lucide-react` (использование `@mui/icons-material` запрещено).
* **Hosting & Infra:** Vercel Pro (edge-functions для динамических поддоменов/роутов портфолио).

### Ключевые токены цвета (Material Design 3 Seed: `#0B6E4F`):

* **Primary:** Forest Green (`#0B6E4F` / CSS var: `--md-sys-color-primary`) — Личность бренда, действия.
* **Secondary:** Coral Red (`#FF6467` / CSS var: `--md-sys-color-secondary`) — Акценты, ключевые вызовы.
* **Tertiary:** Off-white (`#FBFFFA`) — Нейтральные фоновые подложки.
* **Error:** Amber Warning (`#D17D00`) — Ошибки, предупреждения.
* **Fonts:** Poppins (Заголовки), Inter (Основной текст).

---

## 🏗 АРХИТЕКТУРА МУЛЬТИАРЕНДНОЙ ПЛАТФОРМЫ ПОРТФОЛИО

Платформа спроектирована с учетом масштабирования для друзей/дизайнеров:

### 1. Поток создания кейса (`Case Template Engine`):

Форма автозаполнения и сборки кейсов строится строго по схеме 7 секций:

1. **01 Intro & Meta:** Title, URL Slug, Category, Client, Year, Duration, Role, Prototypes, Hero Image.
2. **02 Problem & Audience:** Формулировка проблемы, ЦА, ключевые метрики.
3. **03 User Research:** Методология, Персона, User Story.
4. **04 Design Process:** Подход к проектированию, вайрфреймы, интерфейсы.
5. **05 Testing & Iteration:** Сравнение Before / After, A/B тесты.
6. **06 Final Showcase:** Галерея скриншотов, интерактивные прототипы, инструменты.
7. **07 Reflection & Next Steps:** Главный вывод, отзыв клиента, дальнейшие шаги.

### 2. Динамический роутинг:

* `ux42.studio/` — Главный сайт студии Digital Craftsmanship.
* `ux42.studio/[username]` — Публичная страница портфолио автора.
* `ux42.studio/[username]/[case-slug]` — Страница конкретного кейса.
* `ux42.studio/editor` — Панель управления и конструктор кейсов (Case Template Builder).

---

## ⚙️ ЧЕК-ЛИСТ ВАЛИДАЦИИ ДЛЯ ИИ-АГЕНТА ПЕРЕД КОММИТОМ

Перед завершением генерации кода проверь:

1. [ ] Соблюден ли стандарт доступности **WCAG 2.2 / EAA 2025** (ARIA-метки, поддержка навигации с клавиатуры, семантика H1-H3)?
2. [ ] Все ли цвета и отступы подтянуты из токенов `UX42 Design System`?
3. [ ] Поддерживаются ли динамические режимы Dark / Light theme?
4. [ ] Отсутствуют ли инлайн-стили и хардкод HEX?