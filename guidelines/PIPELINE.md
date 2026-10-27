# Pipeline — UX42 Design System

Рабочий процесс создания, поддержки и масштабирования дизайн-системы UX42 для использования в Figma Make и новых проектах.

## Общая схема

```
Figma (Variables/Styles/Components)
        ↓ (экспорт токенов)
src/app/globals.css (@theme переменные)
        ↓ (реализация компонентов)
src/components/ui/* (Radix + CVA + cn)
        ↓ (документация)
guidelines/ (overview, setup, tokens, components, patterns, anti-patterns)
        ↓ (npm-пакет)
@ux42/design-system (опционально, для Make kit)
        ↓ (подключение)
Figma Make kit → генерация новых экранов
```

---

## Этапы pipeline

### Этап 1: Определение токена (Foundations)

Когда нужно добавить новый цвет, размер, радиус или отступ:

1. **Проверить существование** — токен уже есть в `src/app/globals.css` или `Docs/figma-tokens.md`?
2. **Добавить в CSS** — зарегистрировать переменную в `@theme` блоке `globals.css` (и в `[data-theme="dark"]` для тёмной темы).
3. **Обновить Figma** — синхронизировать значение в Figma Variables (с помощью `Docs/figma-tokens.md` как карты соответствий).
4. **Задокументировать** — внести в `guidelines/tokens.md`.
5. **Проверить** — `npm run check` + визуальная проверка в светлой и тёмной теме.

### Этап 2: Создание компонента

1. **Проверить существующие** — есть ли подходящий компонент в `src/components/ui/`? Если да — использовать, не создавать новый.
2. **Написать component contract** — Purpose, Variants, States, Tokens, Accessibility, Code mapping, Do/Don't (см. `docs/ai-context-contract.md` §6).
3. **Реализовать** — Radix UI примитив + CVA + `cn()`, только токены из `globals.css`, без инлайн-стилей.
4. **Добавить в guidelines** — создать `guidelines/components/<component>.md`.
5. **Обновить Figma** — создать/обновить компонент в Figma с теми же вариантами и состояниями.
6. **Протестировать** — WCAG 2.2 AA, focus-visible, клавиатурная навигация, mobile/desktop, print.

### Этап 3: Документирование паттерна

1. **Создать файл в `guidelines/patterns/`** — например, `responsive-layout.md`, `empty-states.md`, `forms.md`.
2. **Описать** — когда использовать, правила, примеры кода, антипаттерны.
3. **Связать с компонентами** — ссылки на `components/` файлы.

### Этап 4: Обновление антипаттернов

1. **После каждой итерации** — добавить реально встреченные ошибки в `guidelines/anti-patterns.md`.
2. **Не theorize** — только ошибки, которые действительно возникали при generación кода или верстке.

### Этап 5: Подготовка к Figma Make

1. **Проверить `guidelines/`** — все обязательные файлы на месте: `overview.md`, `setup.md`, `tokens.md`, `components/`, `patterns/`, `anti-patterns.md`.
2. **Создать Make kit** — в Figma: подключить публичный npm-пакет (если есть) или публичные токены/стили из Figma-библиотеки.
3. **Добавить guidelines** — прикрепить `guidelines/` к Make kit.
4. **Написать `overview.md` для Make** — короткий вход с ссылками на остальные файлы (не дублировать содержимое).

### Этап 6: Публикация npm-пакета (опционально, для Organization/Enterprise)

Если требуется приватный реестр Figma (Organization/Enterprise план):

1. **Создать `packages/design-system/`** — `package.json`, `src/`, `dist/`, `README.md`.
2. **Экспортировать токены** — CSS переменные, TypeScript типы, компоненты.
3. **Настроить `.npmrc`** — токен из Figma Admin → Resources → npm registry.
4. **Опубликовать** — `npm publish` со scope `@ux42/design-system`.
5. **Подключить к Make kit** — добавить пакет в настройки Make kit.

На плане Professional: использовать публичный npm-пакет (например, `@material/web` или опубликованный `@ux42/design-system` на público npm).

---

## Проверка перед коммитом (для ИИ-агентов)

```
□ Использованы только токены из globals.css
□ Нет инлайн-стилей и хардкод HEX
□ Компонент построен на Radix UI + CVA + cn()
□ Состояния покрыты: default, hover, focus-visible, active, disabled
□ Доступность: ARIA, клавиатура, фокус, контраст WCAG 2.2 AA
□ Проверено в light/dark темах, mobile/desktop
□ Обновлены guidelines/ (если новый компонент или токен)
□ npm run check проходит без ошибок
```

---

## Отчёт после завершения задачи

```md
## Result
Что сделано.

## Files changed
Список изменённых файлов.

## Decisions
Ключевые решения и почему.

## Checks
Что проверено (чизлист выше).

## Open questions
Что требует решения пользователя.
```
