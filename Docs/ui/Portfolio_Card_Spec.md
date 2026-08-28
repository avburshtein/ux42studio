# Portfolio Card — актуализированная спека
Updated: 2026-08-28 — тело переписано по коду
Реализация: src/components/PortfolioCard.tsx + .portfolio-card (src/app/globals.css)
Эталон ховера: Docs/make-export (PortfolioGallery.tsx); решения Main_page_Spec.md (9)–(10)

СТАТУС: §1–5 = текущий код (источник правды). §6 — историческая справка по
Figma-master 87:1429; перечисленное там ОТМЕНЕНО решениями (9)–(10).

---

## 1. КОРЕНЬ КАРТОЧКИ

<Link> — вся карточка кликабельна; flex flex-col; w-full (резиновая:
в ячейке сетки ≈341px; 334×368 — intrinsic размер Figma-мастера);
rounded-[24px]; overflow-hidden;
focus-visible: outline-2 outline-offset-2 outline-primary.

Фон/тени/ховер — класс .portfolio-card (globals.css; правило unlayered —
НЕ дублировать фон/тени Tailwind-классами):

  Light default:
    background: #ffffff;
    box-shadow:
      4px 4px 2px 0px rgba(0,0,0,0.05),
      16px 9px 12px -1px rgba(242,242,242,0.86),
      10px 10px 8px -2px rgba(177,211,196,0.3);

  Light hover:
    transform: scale(1.02);
    box-shadow:
      6px 6px 3px 0px rgba(0,0,0,0.08),
      20px 12px 16px -1px rgba(242,242,242,0.9),
      12px 12px 10px -2px rgba(177,211,196,0.4);

  Dark default ([data-theme='dark']):
    background: rgba(30,30,30,0.9);
    box-shadow:
      0px 20px 40px 0px rgba(0,0,0,0.4),
      0px 10px 20px 0px rgba(0,0,0,0.3);

  Dark hover:
    box-shadow:
      0px 30px 60px 0px rgba(0,0,0,0.5),
      0px 15px 30px 0px rgba(0,0,0,0.4);

  transition: all 500ms ease.

---

## 2. IMAGE CONTAINER

relative, w-full, h-[256px], overflow-hidden.
Image: fill, object-cover, sizes="(min-width: 640px) 341px, 100vw".
Zoom: group-hover:scale-110, duration-700 ease-out (зум идёт ПОД градиентом).

---

## 3. GRADIENT OVERLAY (появляется на hover)

absolute inset-0; bg-gradient-to-t:
  from rgba(11,110,79,0.9) → via rgba(11,110,79,0.5) → to transparent;
opacity 0 → group-hover:opacity-100, duration-500 ease-out;
контент прижат к низу (flex-col justify-end), padding 24px.

Содержимое: ТОЛЬКО ghost-теги — TagBadge variant="ghost" (gap-8, flex-wrap),
slide-up анимация: translate-y-[10px] → 0, duration-500, delay-75.
Заголовок на градиенте УБРАН (фидбэк; overlayTitle удалён из API карточки
и из page.tsx — решение (9)).

---

## 4. TEXT AREA

flex-1, flex-col, gap-8 (8px), px-24 py-24.

Равная высота зоны (фидбэк (10)): фиксированной высоты у карточки НЕТ —
карточки в ряду grid растягиваются до высоты максимальной (align-items:
stretch по умолчанию), flex-1 отдаёт всю разницу текстовой зоне → зоны
в ряду одинаковые. Переполнение страховано truncate на обеих строках.
(Ранее в аддендуме (10) фигурировало «ровно 112px = 368−256» — корректный
механизм именно stretch + flex-1, без фиксации высоты.)

  Title: Poppins Medium 22/30, tracking −0.22px, on-surface-variant,
         статичен (hover-уменьшение 22→20 отменено), truncate.
  Tag:   Inter 16/24, text-primary, truncate.

---

## 5. API

interface PortfolioCardProps {
  title: string;          // заголовок
  tag: string;            // категория (строка под заголовком)
  imageUrl: string;       // cover (fallback /placeholder-project.svg)
  href: string;           // /u/[slug]/[projectSlug]
  overlayTags?: string[]; // ghost-теги на градиенте (до 3 категорий)
  className?: string;
}

---

## 6. ИСТОРИЧЕСКАЯ СПРАВКА — Figma master 87:1429 (2026-08-22)

Компонент-сет 87:1429 «Portfolio Card», секция Cards (Design System 6:2),
варианты Default 334×368 [87:1430] / Hover 341×369 [87:1445].
Оригинальные значения, ОТМЕНЁННЫЕ решениями (9)–(10):
  • фон Schemes/Surface Container Low = #f6f3f4 (сейчас: белый /
    dark rgba(30,30,30,0.9));
  • тени Card Default/Hover (зелёная rgba(177,211,196,.30) + белая .86 +
    чёрная .05) — значения совпали с Make и в коде живут в .portfolio-card;
  • overlay с h6-заголовком на градиенте (сейчас — только теги);
  • hover-уменьшение заголовка 22→20 (сейчас заголовок статичен);
  • main-axis MAX (justify-end) на корне (снят при фиксе равной высоты зоны).
Прежний React/CSS-шаблон из этого файла удалён при перезаписи 2026-08-28.
