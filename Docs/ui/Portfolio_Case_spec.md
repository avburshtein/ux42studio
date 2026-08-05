
---

# Спецификация страницы: Portfolio Case (`Portfolio_Case_spec.md`)

> **Назначение:** Полное техническое задание для генерации и верстки отдельной страницы кейса портфолио (Page ID: `4:263`).
> **Связанные документы:** `design-system-ux42.md`, `case-template-spec.md`.

---

## 1. Общие параметры Layout и сетки

* **Viewport:** `1440px` (Desktop) / `768px` (Tablet) / `375px` (Mobile).
* **Content Max-Width:** `1200px` (центрированный контейнер).
* **Vertical Padding:** `80px` (Desktop) / `48px` (Mobile) для основных секций.
* **Spacing Scale:** `16px / 24px / 32px / 48px / 80px`.
* **Grid:** 12 колонок (Desktop, gap `24px`) / 8 колонок (Tablet, gap `16px`) / 4 колонки (Mobile, gap `16px`).
* **Цветовая палитра:** Использует токены `material-theme` (`Primary: #0B6E4F`, `Background Light: #FCF8FA / Dark: #131314`, `Surface-low`, `Outline`).

---

## 2. Навигация и сквозные элементы

### PC-NAV: Case Navigation Bar

* **Тип:** Sticky Header / Top Bar.
* **Компоненты:**
* Кнопка **«← Назад в портфолио»** (`Link / Secondary Button` с иконкой `arrow-left`).
* **Breadcrumbs:** `Главная / Портфолио / [Название кейса]`.
* **Индикатор чтения (Reading Progress Bar):** Линия высотой `2px` под хедером (`Brand Gradient: #0B6E4F → #2C5A07`), отображающая процент скролла.
* **Быстрый переход (Floating Anchor Menu):** Переключатель секций (Intro, Problem, Research, Process, Showcase, Results) при скролле.



---

## 3. Структура и компоненты страницы

### PC-01: Case Hero

* **Сетка:** 2 колонки (8 колонок текст / 4 колонки мета-данные) на Desktop; 1 колонка на Mobile.
* **Элементы:**
* `Tag/Badge`: Категория (например, `Web Design`, `Branding`).
* `Title (H1)`: Poppins Medium (` display/headline` 48-68px).
* `Subtitle / Tagline`: Inter Regular 18px (цвет `Neutral / Text Secondary`).
* `Meta Grid` (4 карточки/ячейки в рамке `Outline`):
* **Клиент:** Название + логотип.
* **Роль / Команда:** UX/UI, Frontend, PM.
* **Сроки / Год:** e.g., `2026 / 4 недели`.
* **Ссылка на живой проект:** Кнопка-ссылка (`Primary / Secondary` с внешним переходом).




* **Hero Banner / Frame:** Полноширинный фрейм карточки (`1200px × 600px`) с эффектом Glassmorphism или бренд-градиентом и интерактивным превью.

---

### PC-02: Problem & Audience

* **Сетка:** 2 равные колонки (`1:1`) или сплит-блок.
* **Левый блок (Problem Statement):**
* Заголовок `H2` (Poppins 34px) + акцентная плашка `Error / Accent Container`.
* Текстовое описание болей и задач бизнеса.


* **Правый блок (Target Audience & Goals):**
* Карточки целевых персон (`User Personas`) с микро-иконками.
* Список ключевых целей проекта (`Key Objectives`) в виде списков с галочками (`Primary Container Icon`).



---

### PC-03: User Research & Discovery

* **Структура:**
* **Методология:** Чипы/теги использованных методов (CustDev, Eye-tracking, Competitive Analysis).
* **Key Findings (Находки):** Сетка 3x1 из карточек `Surface-low` с градиентным бордером.
* **Quotes / Insights:** Цитаты пользователей или выдержки из исследований.



---

### PC-04: Design Process & Architecture

* **Структура:**
* **UX & Wireframes:** Слайдер или сетка 2x2 с вайрфреймами / информационной архитектурой.
* **Design System Tokens:** Выжимка используемых стилей (UI-кит, цвета, типографика), оформленная в виде стилизованных токенов UX42.
* **Interactive Prototype / Flow Diagram:** Встраиваемый интерактивный блок или схематичный векторный поток.



---

### PC-05: Testing & Iteration

* **Компонент:** `Before / After Comparison` (Интерактивный шторка-слайдер или сплит-сравнение двух вариантов интерфейса).
* **Текст:** Описание результатов юзабилити-тестирования, выявленных проблем и внесенных итераций.

---

### PC-06: Final Showcase (Главный визуальный блок)

* **Галерея:**
* Полноформатные макеты (Desktop & Mobile mockups).
* Интерактивные гифки/видеодемонстрации микро-взаимодействий и анимаций.
* Карточки с акцентным подсчетом фичей (`Feature Cards`).



---

### PC-07: Metrics & Results (Результаты и Влияние)

* **Компонент `PC-03 Metric Row`:**
* Сетка из 3-4 крупных плашек метрик (например, `+140% Conversion Rate`, `< 1.2s PageSpeed`, `WCAG 2.2 Compliant`).
* Числа: Poppins Medium 52px (`Primary Color`).


* **Testimonial Block (Отзыв клиента):**
* Карточка с эффектом Glassmorphism (`Modal/Card shadow`), аватар клиента, имя, должность, цитата и ссылка на видео/аудио-подтверждение.



---

### PC-08: Case Footer & Next Project

* **Навигационный блок внизу:**
* Карточка следующего кейса: `«Следующий проект: Mobile Banking App →»`.
* Кнопка возврата в общее портфолио и CTA-блок студии: `«Хотите похожий результат? Обсудить проект»` (переход к форме контакта/записи).



---

## 4. Маппинг данных (Из `case-template` в `Portfolio case`)

| Секция в `case-template` | Поле источника | Компонент на публичной странице `Portfolio case` |
| --- | --- | --- |
| **01. Intro & Meta** | `Case Title` | `PC-01` → H1 Title |
|  | `Tagline / Teaser` | `PC-01` → Subtitle / Hero Tagline |
|  | `Client Name & Industry` | `PC-01` → Meta Grid (Client) |
|  | `Category & Year` | `PC-01` → Tag / Badge & Meta Grid |
|  | `Cover / Hero Media` | `PC-01` → Hero Frame Image/Video |
| **02. Problem & Audience** | `Business Problem` | `PC-02` → Problem Statement (Left Column) |
|  | `Target Audience & Personas` | `PC-02` → Personas Cards (Right Column) |
| **03. User Research** | `Research Methods` | `PC-03` → Methodology Chips |
|  | `Key Insights` | `PC-03` → Findings Grid (Cards) |
| **04. Design Process** | `Wireframes & Flows` | `PC-04` → Wireframes Gallery |
|  | `UI Assets & Tokens` | `PC-04` → Design System Snippet |
| **05. Testing & Iteration** | `Usability Testing Logs` | `PC-05` → Iteration Notes & Before/After Slider |
| **06. Final Showcase** | `High-res Renders & Video` | `PC-06` → Full-width Showcase Gallery |
| **07. Results & Impact** | `KPIs / Metrics Data` | `PC-07` → Metric Row (Big Numbers) |
|  | `Client Testimonial` | `PC-07` → Testimonial Glass Card |

---

## 5. Адаптивность и состояния компонентов (States)

1. **Desktop (1440px):** Все блоки в полной сетке (2-3 колонки).
2. **Mobile (375px):**
* Все многоколоночные блоки перестраиваются в 1 колонку (`flex-col`).
* Таблицы и макеты галереи трансформируются в горизонтальный скролл (`overflow-x-auto` с snap-точками).
* Sticky Navigation трансформируется в компактный плавающий баббл или нижнюю панель.


3. **Themes (Light & Dark):**
* **Light Mode:** Background `#FCF8FA`, Text `#1B1B1D`, Surface-low `#F6F3F4`.
* **Dark Mode:** Background `#131314`, Text `#E4E2E3`, Surface-low `#1B1B1D`.



---
