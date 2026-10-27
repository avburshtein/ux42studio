# UX42 Design System — Guidelines for Figma Make & AI Agents

Эта папка содержит компактные, тематические правила для Figma Make и ИИ-агентов (Claude, Cursor, Cline). Следует принципу Figma: **короткий вход (`overview.md`) + узкие доменные документы**, а не один огромный markdown.

## Структура

```
guidelines/
├── README.md              # этот файл
├── overview.md            # основные принципы и порядок чтения
├── setup.md               # подключение токенов, провайдеров, конфигурация
├── tokens.md              # правила применения цветовых, типографских, shape токенов
├── components/
│   ├── buttons.md         # Button: варианты, состояния, do/don't
│   ├── inputs.md          # Input: состояния, токены, валидация
│   ├── cards.md           # Card: варианты, spacing, elevation
│   └── dialogs.md         # Dialog: focus trap, закрытие, а11y
├── patterns/
│   ├── responsive-layout.md   # breakpoints, контейнеры, хедера
│   └── empty-states.md        # пустые состояния, действия
└── anti-patterns.md       # запреты: хардкод, дубли, лишние компоненты
```

## Как использовать

### Для Figma Make kit
1. Добавьте папку `guidelines/` в Make kit.
2. `overview.md` — главный вход, ссылается на остальные файлы.
3. Не дублируйте содержимое `Docs/design-system.md` — давайте ссылки и только правила, нужные для генерации.

### Для ИИ-агентов (Claude / Cursor / Cline)
1. Прочтите `docs/ai-context-contract.md` — стандарт контекста.
2. Используйте `guidelines/` как уточняющие правила по UI.
3. При создании нового компонента следуйте `PIPELINE.md`.

## Связанные документы

- `Docs/design-system.md` — канон кода (токены, компоненты, лейауты)
- `Docs/figma-tokens.md` — карта код ↔ Figma
- `docs/ai-context-contract.md` — стандарт контекста для ИИ
- `Docs/CLAUDE.md` — глобальные правила проекта
- `guidelines/PIPELINE.md` — процесс разработки дизайн-системы
