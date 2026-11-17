<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Привет! Подскажи пожалуйста, что такое Admin npm registry в Figma?

**Admin npm registry** в Figma — это раздел в настройках организации, где администратор подключает и управляет **приватным npm-реестром** для Figma Make. Он нужен, чтобы публиковать и использовать внутри компании собственные npm-пакеты, например пакет вашей дизайн-системы.[^1_1][^1_2]

## Зачем он нужен

В Figma Make можно подключать кодовые пакеты через npm. Публичные пакеты доступны всем, а приватный реестр Figma позволяет хранить пакеты только для вашей организации — например, компоненты, токены, стили и утилиты вашего дизайн-система-пакета.[^1_2][^1_3]

Типичный сценарий для вас: вы собираете дизайн-систему в npm-пакет, публикуете его в приватный реестр, а затем используете его в **Make kit**, чтобы Figma Make генерировала интерфейсы и прототипы в вашем визуальном языке.[^1_4][^1_1]

## Где находится

Путь в Figma:

**File browser → Admin → Resources → npm registry**

Этот раздел доступен администраторам организации; именно org admin создаёт и управляет **scopes** — пространствами имён для приватных пакетов.[^1_5][^1_1]

## Что там делают

- Создают scope, например `@yourcompany`, чтобы избежать конфликтов с публичными пакетами.[^1_2]
- Получают конфигурацию для файла `.npmrc`, включая токен доступа для публикации пакета.[^1_1]
- Публикуют пакет командой `npm publish`.[^1_1]
- Просматривают опубликованные пакеты и удаляют отдельные версии или пакеты целиком.[^1_1]


## Как это работает

Пакет обычно называется со scope, например:

```text
@yourcompany/design-system
```

В `.npmrc` добавляется конфигурация реестра и токен, после чего пакет публикуется из репозитория. Затем его можно добавить в Make kit и использовать в проектах Figma Make внутри организации.[^1_4][^1_1]

## Важные ограничения

- Управлять scopes может только **organization admin**.[^1_3][^1_1]
- Приватные пакеты доступны файлам Make внутри вашей организации, но не снаружи.[^1_1]
- Публичный npm-реестр доступен всем пользователям Make; публикация и использование приватных пакетов требуют платного плана.[^1_3][^1_1]
- Токен из **View configuration** генерируется заново при каждом открытии конфигурации, поэтому его нужно хранить безопасно.[^1_6]

Проще говоря: это «внутренний npm-хранилище вашей компании в Figma», через которое дизайн-система из кода становится доступна Figma Make.

<span style="display:none">[^1_10][^1_7][^1_8][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://help.figma.com/hc/en-us/articles/43602872461079-Bring-your-design-system-package-to-a-Make-kit

[^1_2]: https://help.figma.com/hc/en-us/articles/43601939953431-Working-with-npm

[^1_3]: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits

[^1_4]: https://help.figma.com/hc/en-us/articles/39313426360087-Manage-Make-kits-for-an-organization

[^1_5]: https://help.figma.com/hc/en-us/articles/4420557724439-Admins-in-Figma

[^1_6]: https://forum.figma.com/report-a-problem-6/private-npm-registry-auth-token-cycling-56532

[^1_7]: https://help.figma.com/hc/de/articles/360039829474-Leitfaden-zur-Verwaltung-einer-Figma-Organisation

[^1_8]: https://help.figma.com/hc/en-us/articles/360039829474-Guide-to-managing-a-Figma-organization

[^1_9]: https://help.figma.com/hc/es-419/articles/360039829474-Guía-para-administrar-una-organización-de-Figma

[^1_10]: https://help.figma.com/hc/en-us/articles/360041051154-Guide-to-libraries-in-Figma


---

# А если у меня подписка профешнл, что я могу сделать внутри этого раздела?

Если у вас **Figma Professional**, раздел **Admin → Resources → npm registry** скорее всего будет недоступен или не даст управлять приватным реестром: управление scopes и публикация в приватный npm-реестр Figma доступны только **organization admin** на планах **Organization/Enterprise**.[^2_1][^2_2]

## Что доступно на Professional

- **Использовать публичные npm-пакеты** в Figma Make и в Make kits — это доступно пользователям Make на платных планах.[^2_2][^2_3]
- **Собирать и публиковать Make kit** для своей команды: добавить публичные npm-пакеты, переменные и стили из опубликованной Figma-библиотеки, а также guidelines для Make.[^2_3][^2_4]
- **Использовать публичный пакет вашей дизайн-системы**, если вы опубликуете его в обычном npm-реестре, например как `@ваш-scope/design-system`.[^2_5][^2_2]
- **Настраивать имя пакета и scope при публикации Make kit**, если Make kit экспортируется как npm-пакет.[^2_3]


## Чего не будет

- Создавать **scopes** в приватном реестре Figma.
- Получать `.npmrc`-конфигурацию и токен для публикации в приватный реестр Figma.
- Публиковать приватный npm-пакет только для вашей организации.
- Просматривать и удалять приватные пакеты/версии в этом разделе.

Эти функции относятся к приватному Figma-hosted npm registry и требуют роли organization admin; на Professional такой роли и организационного уровня управления нет.[^2_6][^2_1]

## Практичный вариант для вас

Вы можете подготовить дизайн-систему как обычный npm-пакет и опубликовать его публично, затем подключить его к Make kit. Если код нельзя делать публичным, на Professional приватный реестр Figma не подойдёт — потребуется Organization/Enterprise либо внешний приватный npm-хостинг, если Figma Make поддерживает его подключение в вашем сценарии.[^2_2][^2_5]

Коротко: на Professional вы можете **потреблять публичные npm-пакеты и делать Make kits**, но **не администрировать приватный npm registry Figma**.[^2_1][^2_3]

<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_7][^2_8][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://help.figma.com/hc/en-us/articles/43602872461079-Bring-your-design-system-package-to-a-Make-kit

[^2_2]: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits

[^2_3]: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits

[^2_4]: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make

[^2_5]: https://www.figma.com/blog/introducing-make-kits-and-make-attachments/

[^2_6]: https://help.figma.com/hc/en-us/articles/4420557724439-Admins-in-Figma

[^2_7]: https://help.figma.com/hc/en-us/articles/31304586129559-Publish-update-or-unpublish-a-Figma-Make-file

[^2_8]: https://help.figma.com/hc/en-us/articles/31722591905559-Figma-Make-FAQs

[^2_9]: https://help.figma.com/hc/en-us/articles/360052679454-Access-shared-resources-in-an-organization

[^2_10]: https://help.figma.com/hc/en-us/categories/31304285531543-Figma-Make

[^2_11]: https://help.figma.com/hc/en-us/categories/360001980773-Administration

[^2_12]: https://www.g2.com/products/figma/reviews

[^2_13]: https://help.figma.com/hc/en-us/articles/43601939953431-Working-with-npm

[^2_14]: https://help.figma.com/hc/en-us/articles/360039829474-Guide-to-managing-a-Figma-organization

[^2_15]: https://help.figma.com/hc/en-us/articles/39313426360087-Manage-Make-kits-for-an-organization


---

# Если я хочу использовать дизайн систему М3 от Google, я могу это сделать на своем плане7

Да. На **Professional** вы можете использовать Material Design 3 (M3) от Google, потому что публичные npm-пакеты доступны в Figma Make и Make kits на платных планах.[^3_1][^3_2]

## Два способа

| Способ | Что подключить | Подходит ли на Professional |
| :-- | :-- | :-- |
| **Figma-библиотека M3** | Официальный **Figma M3 Design Kit** от Google: компоненты, стили, токены | Да, для дизайна в Figma [^3_3] |
| **npm-пакет для Make** | Публичный пакет Material Web, например `@material/web`, либо другой M3-пакет | Да, если это публичный npm-пакет [^3_1][^3_4] |
| **Приватный npm registry Figma** | Свой приватный пакет/форк M3 внутри организации | Нет: требуется Organization/Enterprise и organization admin [^3_5][^3_1] |

## Важный нюанс

Официальная библиотека Google **Material Web Components (`@material/web`)** сейчас находится в режиме поддержки: новых обновлений не выпускают, а **Material 3 Expressive для Web в ней не реализован**. Поэтому для нового веб-продукта стоит сначала проверить, насколько вам важны актуальные компоненты и M3 Expressive.[^3_4]

## Как сделать в Figma Make

1. Установите или добавьте публичный npm-пакет M3 в Make kit — например `@material/web`, если он соответствует вашему стеку.[^3_6][^3_4]
2. Добавьте в Make kit guidelines: правила токенов, типографики, spacing, цветовых ролей и использования компонентов.
3. Подключите Figma-библиотеку M3 или собственные переменные, чтобы визуальная часть и генерируемый код были согласованы.[^3_2][^3_7]
4. Генерируйте интерфейсы в Figma Make с опорой на этот kit.

## Рекомендация

Для вашего UX/design-system сценария лучший вариант на Professional: **официальный M3 Design Kit в Figma + публичный npm-пакет в Make kit + собственный файл guidelines**. Так вы получите M3-основу без необходимости в приватном npm registry.[^3_3][^3_1][^3_6]

<span style="display:none">[^3_10][^3_11][^3_12][^3_13][^3_14][^3_15][^3_8][^3_9]</span>

<div align="center">⁂</div>

[^3_1]: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits

[^3_2]: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits

[^3_3]: https://m3.material.io/get-started

[^3_4]: https://m3.material.io/develop/web

[^3_5]: https://help.figma.com/hc/en-us/articles/43602872461079-Bring-your-design-system-package-to-a-Make-kit

[^3_6]: https://www.figma.com/blog/introducing-make-kits-and-make-attachments/

[^3_7]: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make

[^3_8]: https://m3.material.io/develop

[^3_9]: https://state-of-ai-in-design-systems.netlify.app/platforms/figma.json

[^3_10]: https://www.g2.com/products/figma/reviews?page=5

[^3_11]: https://github.com/floor/material

[^3_12]: https://help.figma.com/hc/en-us/articles/43601939953431-Working-with-npm

[^3_13]: https://help.figma.com/hc/en-us/articles/39313426360087-Manage-Make-kits-for-an-organization

[^3_14]: https://help.figma.com/hc/en-us/categories/31304285531543-Figma-Make

[^3_15]: https://help.figma.com/hc/en-us/articles/31722591905559-Figma-Make-FAQs


---

# Как написать правильные guidelines для Make kit

Правильные guidelines для Make kit — это не «документация обо всём», а **короткие, точные правила для агента**: что использовать, когда, как и чего не делать. Figma рекомендует разбивать их на небольшой главный файл и тематические подпапки, а не создавать один огромный markdown.[^4_1][^4_2]

## Структура файлов

Для Make kit с M3-пакетом подойдёт такая структура:

```text
guidelines/
├── overview.md
├── setup.md
├── tokens.md
├── styles.md
├── components/
│   ├── buttons.md
│   ├── forms.md
│   ├── navigation.md
│   └── feedback.md
├── patterns/
│   ├── empty-states.md
│   ├── forms.md
│   └── responsive-layout.md
└── anti-patterns.md
```

Figma сама предлагает начальную структуру с `guidelines/`, `components/`, `Guidelines.md`, `setup.md`, `styles.md` и `tokens.md`; для каждого компонента стоит описывать назначение, когда использовать, корректные и некорректные примеры и API.[^4_1]

## Главный файл: `overview.md`

Он должен быть коротким «входом» для Make: продукт, приоритеты, обязательные правила и ссылки на остальные файлы.

```md
# Product guidelines

## Product
Build clean, accessible, responsive web interfaces using Material Design 3.

## Read first
1. `setup.md` — required imports, providers, and configuration
2. `tokens.md` — color, typography, spacing, radius, and elevation rules
3. `components/` — component usage rules
4. `anti-patterns.md` — patterns that must not be generated

## Core principles
- Use Material 3 components and tokens instead of custom styling.
- Prefer responsive layouts with flexbox or CSS grid.
- Use semantic HTML and accessible labels for all interactive elements.
- Keep one primary action per screen or section.
- Do not invent components when an M3 component exists.

## Definition of done
- Layout works on mobile and desktop.
- Interactive elements have visible hover, focus, active, and disabled states.
- Text meets contrast requirements.
- No hardcoded colors, font sizes, spacing, or radii.
```

Figma советует делать родительский файл с ссылками на небольшие файлы по задачам — это удерживает контекст сфокусированным и снижает лишнее потребление кредитов.[^4_2]

## `setup.md`: как подключать M3

Здесь опишите только то, что Make должен сделать перед генерацией кода: импорты, провайдеры, шрифты, CSS-переменные, сборка.

```md
# Setup

## Required setup
- Install and import the selected Material 3 package before using its components.
- Import global styles and theme configuration once at the application entry point.
- Use the package’s theme/token mechanism; do not duplicate token values in local CSS.

## Rules
- Do not add a second design system or UI library.
- Do not override M3 component internals with arbitrary CSS unless no supported API exists.
- If a required M3 component is unavailable, use the closest supported component and explain the limitation in code comments.
```


## `tokens.md`: источник правды

Не копируйте все значения из M3. Опишите **правила применения токенов** и назовите источник.

```md
# Tokens

## Source of truth
Use Material 3 design tokens from the connected npm package and Figma library.

## Color
- Use semantic roles: primary, on-primary, surface, on-surface, error, etc.
- Never hardcode hex values in components.
- Use error color only for destructive actions, validation errors, and critical system states.

## Typography
- Use M3 type roles: display, headline, title, body, and label.
- Do not create custom font sizes for standard UI text.
- Use `body-medium` as the default reading text unless another role is explicitly appropriate.

## Shape and elevation
- Use M3 shape tokens for corners.
- Use elevation only to communicate hierarchy, overlays, menus, dialogs, and floating elements.
```


## `components/buttons.md`: шаблон компонента

Для каждого ключевого компонента используйте одинаковый формат: **зачем → когда → варианты → как → антипаттерны**. Figma рекомендует включать назначение, сценарии использования, правильные/неправильные паттерны и API компонента.[^4_1]

````md
# Buttons

## Purpose
Buttons trigger a user-initiated action or navigation.

## When to use
- Use a filled button for the single primary action on a screen or section.
- Use a tonal or outlined button for secondary actions.
- Use a text button for low-emphasis actions inside dialogs, cards, or toolbars.

## Rules
- Use clear, verb-first labels: “Save changes”, “Create project”, “Delete file”.
- Show only one filled primary button per screen or section.
- Disable a button while its action is pending; do not hide it.
- Use destructive styling only for irreversible or high-risk actions.

## Do
```tsx
<Button variant="filled" onClick={save}>Save changes</Button>
````


## Don’t

- Do not use “Submit” when the action is clearer as “Create account”.
- Do not place two filled buttons side by side with equal visual weight.
- Do not use a button for navigation when a link or navigation item is more appropriate.

````

## `anti-patterns.md`: запреты

Это один из самых полезных файлов: он предотвращает типовые ошибки генерации.

```md
# Anti-patterns

## Never do
- Do not use absolute positioning for standard page layout.
- Do not hardcode colors, spacing, radii, or font sizes.
- Do not use a dropdown when there are two or fewer options; use radio buttons or a segmented control.
- Do not use a floating action button together with a bottom navigation bar.
- Do not create custom buttons, inputs, cards, or dialogs when M3 components exist.
- Do not generate placeholder text such as “Lorem ipsum” in final UI.

## Prefer instead
- Use flexbox or grid for responsive layout.
- Use M3 tokens and semantic color roles.
- Use a select only for 3+ options.
- Use clear empty, loading, error, and success states.
````

Figma прямо приводит похожие правила: например, не использовать dropdown при двух и менее опциях и не сочетать FAB с нижней панелью навигации.[^4_3]

## Как писать формулировки

Пишите правила так, чтобы их можно было **однозначно выполнить**:


| Плохо | Хорошо |
| :-- | :-- |
| «Сделай красиво» | «Используй M3-токены; один filled button на экран; отступы из spacing-токенов» |
| «Не используй плохие паттерны» | «Не используй dropdown при 1–2 опциях; используй radio buttons или segmented control» |
| «Кнопки должны быть понятными» | «Используй глагол в инфинитиве: “Save changes”, “Create project”» |
| «Поддерживай доступность» | «Добавь `aria-label` для icon-only кнопок; обеспечь видимый focus state» |

## Чего избегать

- **Не дублируйте** то, что уже содержится в npm-пакете или Figma-библиотеке: это увеличивает контекст и расход кредитов без пользы.[^4_2]
- **Не пишите роман**: Make лучше работает с короткими правилами и примерами.[^4_3]
- **Не описывайте каждый вариант каждого компонента**, если он не влияет на типовые генерации.
- **Не смешивайте** правила визуального дизайна, кода, контента и процессов в одном файле.


## Быстрый чек-лист

- Есть ли `overview.md` с обязательными правилами и порядком чтения?
- Описан ли `setup.md`: импорты, тема, токены?
- Есть ли правила для tokens, typography, color, spacing?
- Для 5–10 ключевых компонентов есть ли purpose, usage, do/don’t и пример?
- Есть ли `anti-patterns.md` с конкретными запретами?
- Каждое правило проверяемо и не дублирует npm-пакет или библиотеку?
- Файлы короткие, тематические и связаны ссылками?

Для вашего M3-кита я бы начал с **`overview.md`, `setup.md`, `tokens.md`, `anti-patterns.md`** и отдельных файлов для `Button`, `TextField`, `Card`, `Navigation`, `Dialog`, `Snackbar`. Это даст Make достаточно контекста, не перегружая его.[^4_2][^4_1]

<span style="display:none">[^4_10][^4_11][^4_12][^4_13][^4_14][^4_15][^4_4][^4_5][^4_6][^4_7][^4_8][^4_9]</span>

<div align="center">⁂</div>

[^4_1]: https://help.figma.com/hc/en-us/articles/43602393097239-Write-design-system-guidelines-for-Make-kits

[^4_2]: https://help.figma.com/hc/en-us/articles/40097793879191-Best-practices-for-optimizing-AI-credits-in-Figma-Make

[^4_3]: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make

[^4_4]: https://help.figma.com/hc/en-us/articles/43509372175511-Add-guidelines-files-to-a-design-library

[^4_5]: https://help.figma.com/hc/es-es/articles/33665861260823-Añadir-directrices-a-Figma-Make

[^4_6]: https://help.figma.com/hc/es-419/articles/33665861260823-Agregar-pautas-a-Figma-Make

[^4_7]: https://www.figma.com/make/

[^4_8]: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits

[^4_9]: https://help.figma.com/hc/en-us/articles/43602872461079-Bring-your-design-system-package-to-a-Make-kit

[^4_10]: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits

[^4_11]: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make

[^4_12]: https://help.figma.com/hc/en-us/articles/43601939953431-Working-with-npm

[^4_13]: https://help.figma.com/hc/en-us/categories/31304285531543-Figma-Make

[^4_14]: https://help.figma.com/hc/en-us/articles/39313426360087-Manage-Make-kits-for-an-organization

[^4_15]: https://www.figma.com/blog/introducing-make-kits-and-make-attachments/


---

# Это очень полезная информация и часть Workflow для работы с любым ИИ агентом. Надо внедрить к себе

Да, это действительно универсальный принцип: **не «промптить каждый раз заново», а дать агенту компактный, структурированный контекст и жёсткие правила**. У вас для Flow уже есть почти вся база — `CLAUDE.md`, `docs/`, UI-правила, state management и токены, — поэтому Make kit guidelines стоит внедрять не как отдельную систему, а как ещё один слой того же workflow.

## Как это ложится в ваш workflow

| Слой | Где живёт | Что решает |
| :-- | :-- | :-- |
| Общий контекст | `CLAUDE.md` | Продукт, стек, приоритеты, ограничения |
| UI-правила | `docs/ui-layout-m3.md`, `ui-rules.md` | Иерархия, layout, M3, доступность |
| Состояния и данные | `state-management.md` | Поведение интерфейса и данные |
| Компонентные контракты | `docs/figma/` | Figma-компоненты, states, tokens, code mapping |
| Make kit guidelines | `guidelines/` в Make kit | Как Figma Make генерирует новые экраны и код |

Это согласуется с вашим уже сложившимся подходом: короткий entry-point плюс узкие доменные документы, а не один огромный файл.

## Что перенести из Make kit в обычные агенты

Из guidelines для Figma Make в `CLAUDE.md` или `docs/` стоит вынести четыре вещи:

- **Source of truth**: какие токены, компоненты и библиотеки считать каноническими.
- **Definition of done**: что считается готовым экраном или компонентом.
- **Anti-patterns**: что агенту запрещено делать.
- **Decision rules**: как выбирать между компонентами и паттернами.

Например, правило «не использовать dropdown при 1–2 опциях» одинаково полезно и Figma Make, и Cursor/Claude при генерации React-кода.[^5_1]

## Практичное внедрение

Я бы сделала так:

1. Создать в `docs/` файл `ai-context-contract.md` — общий стандарт: как писать правила для любого ИИ-агента.
2. В `CLAUDE.md` оставить только ссылки и 10–15 критичных правил.
3. Для Figma Make собрать отдельный `guidelines/` из уже готовых `ui-layout-m3.md`, `ui-rules.md` и компонентных спецификаций.
4. Для каждого компонента вести один **component contract**: назначение, states, tokens, accessibility, code mapping, do/don’t. Это вы уже планировали как `components-index.md` и спецификации компонентов.
5. После каждой удачной итерации добавлять в anti-patterns только новые, реально встретившиеся ошибки — так документация будет расти от практики, а не превращаться в теорию.

## Главный принцип

Формула для любого агента:

```text
Цель → Источник правды → Ограничения → Правила → Состояния → Проверка результата
```

То есть агент должен всегда знать не только «что сделать», но и **по каким критериям результат будет принят**. Ваш production-oriented подход к промптам для Figma Make — с source of truth, states, tokens, layout rules и handoff — уже именно об этом.

Если хотите, следующим шагом могу собрать единый шаблон `ai-context-contract.md` для Flow: его можно будет использовать и для Make kit, и для Cursor/Claude, и для новых ИИ-коллег.

<span style="display:none">[^5_2][^5_3][^5_4][^5_5][^5_6][^5_7][^5_8]</span>

<div align="center">⁂</div>

[^5_1]: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make

[^5_2]: https://www.perplexity.ai/search/ec80803d-342d-4152-a648-94004480acdb

[^5_3]: https://www.perplexity.ai/search/e6c039a3-c135-47d8-ad51-f65efe9613b2

[^5_4]: https://www.perplexity.ai/search/16affce4-1ebe-4c15-a0aa-1169791a5f49

[^5_5]: https://www.perplexity.ai/search/bcc1bfd8-f9e8-4de2-a691-c90a461704cf

[^5_6]: https://www.perplexity.ai/search/a6b76211-fb0f-496f-8567-86ce396a429d

[^5_7]: https://www.perplexity.ai/search/aeebf399-3bd4-41b2-b57d-8e1b2954b906

[^5_8]: https://www.perplexity.ai/search/24fd5972-e2ac-41cf-9b4e-c5a2a17f3a14


---

# Давай

Готово — ниже готовый файл `docs/ai-context-contract.md` для Flow. Он задаёт единый стандарт контекста для **любого ИИ-агента**: Claude, Cursor, Figma Make, новых чатов и будущих инструментов. Он опирается на вашу уже сложившуюся структуру: `CLAUDE.md` как вход, `docs/current/` для актуальных правил, `docs/specs/` для фич и `docs/figma/` для дизайн-данных.

````md
# AI Context Contract — Flow Calendar

Этот документ определяет, как ИИ-агенты получают контекст, принимают решения и проверяют результат в проекте Flow Calendar.

Он обязателен для:
- Claude / CLAUDE.md
- Cursor / Cline
- Figma Make
- Любого нового ИИ-агента или LLM-чата

Агент не должен «додумывать» продукт, дизайн-систему или архитектуру. Он работает по явным правилам и источникам правды.

---

## 1. Порядок чтения контекста

Перед выполнением задачи агент читает документы в следующем порядке:

1. `CLAUDE.md` — продукт, стек, ограничения, текущие приоритеты.
2. `docs/ai-context-contract.md` — этот контракт.
3. `docs/ai-manifesto.md` — продуктовая философия Flow.
4. `docs/ui-layout-flow.md` — правила компоновки, M3, иерархии и адаптивности.
5. `docs/current/` — актуальные правила: state management, UI rules, sitemap.
6. `docs/specs/` — спецификация конкретной фичи или экрана.
7. `docs/figma/` — токены, переменные и компонентные контракты.
8. `TEST_PLAN.md` — критерии проверки результата.

Если документы конфликтуют, приоритет такой:

1. Спецификация конкретной задачи в `docs/specs/`
2. Актуальные правила в `docs/current/`
3. Базовые правила в `docs/`
4. `CLAUDE.md`
5. Общие рекомендации из внешних источников

Агент обязан явно сообщить о конфликте, а не молча выбрать один из вариантов.

---

## 2. Источники правды

| Область | Источник правды | Агент не должен |
|---|---|---|
| Токены | `tokens.css` и Figma Variables | Вводить новые HEX, размеры, радиусы или тени |
| UI-компоненты | Утверждённые компоненты Flow / M3 | Создавать дубли компонентов |
| Layout | `docs/ui-layout-flow.md` | Использовать абсолютное позиционирование для базовой раскладки |
| Состояния | `docs/current/state-management.md` | Придумывать собственную модель состояния |
| Навигация | `docs/current/APP_SITEMAP.md` | Добавлять экраны вне карты продукта |
| Спецификация фичи | Файл в `docs/specs/` | Расширять scope без запроса |
| Тесты | `TEST_PLAN.md` | Считать задачу завершённой без проверки критериев |

---

## 3. Формат задачи

Каждая задача от агента должна начинаться с краткого контракта:

```md
## Task
Что нужно сделать.

## Goal
Какой пользовательский или продуктовый результат должен быть достигнут.

## Scope
Что входит в задачу.

## Out of scope
Что агент не должен менять.

## Source of truth
Какие файлы, токены, компоненты и спецификации использовать.

## Acceptance criteria
Как проверить, что задача выполнена.
````

Если пользователь не дал часть контекста, агент сначала задаёт уточняющие вопросы. Нельзя начинать крупную реализацию на основе неполного брифа.

______________________________________________________________________

## 4. Правила работы с UI

Агент должен:

- Использовать только утверждённые токены Flow и M3.
- Строить layout через flexbox или CSS grid.
- Сохранять чёткую визуальную иерархию: один главный экран/секция, одна основная action.
- Проектировать состояния: default, hover, focus, active, disabled, loading, empty, error, success.
- Учитывать left-handed mode, Recovery Mode и `prefers-reduced-motion`.
- Проверять поведение на mobile и desktop.
- Использовать семантический HTML и доступные названия для интерактивных элементов.

Агент не должен:

- Хардкодить цвета, шрифты, отступы, радиусы или тени.
- Создавать кастомные компоненты, если существует подходящий компонент Flow или M3.
- Добавлять визуальные эффекты, которые ухудшают ясность или производительность.
- Использовать dropdown при 1–2 вариантах выбора.
- Сочетать FAB с bottom navigation.
- Генерировать placeholder-текст в финальном UI.

______________________________________________________________________

## 5. Правила работы с кодом

Агент должен:

- Сохранять текущую архитектуру и границы слоёв.
- Не переписывать работающий код без явной необходимости.
- Предпочитать минимальное изменение максимальному рефакторингу.
- Использовать существующие утилиты, хуки, компоненты и типы.
- Добавлять типы для новых данных и публичных API.
- Обновлять документацию, если изменение меняет поведение, архитектуру или UI-правила.

Агент не должен:

- Менять глобальную архитектуру в рамках небольшой задачи.
- Удалять или переименовывать токены, компоненты и файлы без подтверждения.
- Вводить новую UI-библиотеку, state-менеджер или зависимость без явного запроса.
- Оставлять неиспользуемый код, закомментированные блоки или временные решения.

______________________________________________________________________

## 6. Работа с Figma и design handoff

Для передачи компонента агент работает с **component contract**, а не с картинкой.

Минимальный состав контракта:

```md
# Component: Button

## Purpose
Зачем существует компонент.

## Variants
- Filled
- Tonal
- Outlined
- Text

## States
- Default
- Hover
- Focus
- Active
- Disabled
- Loading

## Tokens
- Color: surface / primary / on-primary
- Shape: radius token
- Typography: label-large
- Spacing: spacing tokens

## Accessibility
- Имя, роль, состояние
- Focus behavior
- Touch target

## Code mapping
- Компонент: `Button`
- Props: `variant`, `size`, `disabled`, `loading`
- Импорт: путь к компоненту

## Do / Don’t
- Do: один filled button на секцию
- Don’t: два equally weighted primary actions
```

Для Figma Make эти же правила упаковываются в `guidelines/`: `overview.md`, `setup.md`, `tokens.md`, `components/`, `patterns/` и `anti-patterns.md`.

______________________________________________________________________

## 7. Проверка результата

Перед тем как считать задачу завершённой, агент проверяет:

1. Выполнены ли acceptance criteria.
2. Использованы ли только утверждённые токены и компоненты.
3. Работает ли UI в основном и альтернативных режимах.
4. Покрыты ли все необходимые состояния.
5. Не нарушены ли layout, accessibility и performance-правила.
6. Обновлены ли связанные документы.
7. Нет ли новых предупреждений, ошибок сборки или регрессий.

Агент должен завершать работу коротким отчётом:

```md
## Result
Что сделано.

## Files changed
Список изменённых файлов.

## Decisions
Ключевые решения и почему.

## Checks
Что проверено.

## Open questions
Что требует решения пользователя.
```


______________________________________________________________________

## 8. Антипаттерны агента

Агенту запрещено:

- Начинать реализацию без источника правды.
- Изобретать новые паттерны, если они уже описаны в docs.
- Смешивать продуктовую задачу, рефакторинг и редизайн в одном изменении.
- Молча расширять scope.
- Выдавать «красивый» результат, который не проходит проверки.
- Ссылаться на устаревшие документы как на актуальные.
- Скрывать неопределённости и риски.

______________________________________________________________________

## 9. Обновление контракта

Этот документ обновляется, когда:

- Меняется стек или архитектура.
- Появляется новый обязательный источник правды.
- Обнаруживается повторяющаяся ошибка ИИ-агента.
- Меняется процесс design-to-code handoff.
- Вводится новый обязательный режим UI.

Каждое изменение должно быть коротким, конкретным и проверяемым.

````

## Как подключить

1. Сохраните файл как `docs/ai-context-contract.md`.
2. Добавьте в `CLAUDE.md` короткий блок:

```md
## AI context contract
All AI agents must follow `docs/ai-context-contract.md`.

Read order:
1. CLAUDE.md
2. docs/ai-context-contract.md
3. docs/ai-manifesto.md
4. docs/ui-layout-flow.md
5. docs/current/
6. docs/specs/
7. docs/figma/
8. TEST_PLAN.md
````

3. В Figma Make используйте те же правила, но в формате `guidelines/`: `overview.md` ссылается на `setup.md`, `tokens.md`, `components/` и `anti-patterns.md`.
4. Не копируйте содержимое `ui-layout-flow.md` в Make kit — давайте ссылки и только те правила, которые нужны агенту для генерации. Это соответствует вашему принципу «короткий вход + узкие документы» и помогает не раздувать контекст.

Этот контракт превращает вашу экспертизу в повторяемый workflow: любой агент получает одинаковые границы, источники правды и критерии готовности.

<span style="display:none">[^6_1][^6_2][^6_3][^6_4][^6_5]</span>

<div align="center">⁂</div>

[^6_1]: https://www.perplexity.ai/search/6e2f417c-0b9d-4265-b1c3-c9b9bddadf79

[^6_2]: https://www.perplexity.ai/search/88c49011-f5a5-4353-82d0-0f0b0fb1047e

[^6_3]: https://www.perplexity.ai/search/e6c039a3-c135-47d8-ad51-f65efe9613b2

[^6_4]: https://www.perplexity.ai/search/4ebce92a-5701-4243-bf73-a0932ba18872

[^6_5]: https://www.perplexity.ai/search/104ba937-16ec-4cee-82e3-0d7a39a2e3b8

