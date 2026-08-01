# Figma Master Components & Variables Specification (figma-master-components-spec.md)

> **Назначение:** Жёсткий алгоритм и правила для ИИ-агентов при создании, обновлении и структурировании мастер-компонентов, переменных и стилей в Figma для экосистемы **UX42.studio**.
> **Источник правды:** Figma-файл (file key: U5OjywCHbtzQgBsi7PU25r)
> **Дата обновления:** 2026-07-23

---

## 1. Архитектура Figma Variables (Token Alignment)

### 1.1 Коллекции переменных (Variable Collections)

| Коллекция | Тип | Кол-во | Режимы | Scoping |
|-----------|-----|--------|--------|---------|
| material-theme | COLOR | 322 | Light, Dark, + Med/High Contrast (6 итого) | ALL_FILLS, STROKE_COLOR |
| spacing | FLOAT | 22 | Default | GAP, WIDTH_HEIGHT |
| radius | FLOAT | 12 | Default | CORNER_RADIUS |
| sizing | FLOAT | 19 | Default | WIDTH_HEIGHT |
| opacity | FLOAT | 17 | Default | OPACITY |

Всего: 5 коллекций, 392 переменных.

### 1.2 Конвенция именования переменных

Все цветовые переменные из коллекции `material-theme` используют следующие префиксы:

| Префикс | Пример | Назначение |
|---------|--------|------------|
| `Schemes/` | `Schemes/Primary`, `Schemes/On Surface` | Семантические цвета (55 на каждую схему) |
| `Surfaces/` | `Surfaces/Surface Tint 5%` | Elevation tints (полупрозрачные оверлеи) |
| `State Layers/` | `State Layers/Primary/8` | Интерактивные состояния |
| `Extended Colors/` | `Extended Colors/Lime/Color` | Кастомные extended-цвета |
| `Palettes/` | `Palettes/Primary/40` | Тональные палитры |

**КРИТИЧЕСКИ ВАЖНО:** Переменные начинаются с `Schemes/`, НЕ с `color/sys/`.
Примеры правильных имён:
- `Schemes/Primary` (НЕ `color/sys/primary`)
- `Schemes/On Surface` (НЕ `color/sys/on-surface`)
- `Schemes/Surface Container Lowest` (НЕ `color/sys/surface`)
- `Schemes/Outline Variant` (НЕ `color/sys/outline-variant`)
- `Schemes/Secondary` (НЕ `color/sys/secondary`)

### 1.3 Числовые токены

**Spacing (`spacing/`):**
0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 120, 160

**Radius (`radius/`):**
none (0), xs (4), sm (8), md (10), base (12), lg (14), xl (16), 2xl (20), 3xl (24), 4xl (28), 5xl (48), full (9999)

**Sizing (`sizing/`):**
- Иконки: icon/xs (16), icon/sm (18), icon/md (20), icon/lg (24), icon/xl (32)
- Кнопки: button/sm (36), button/md (44), button/lg (48), button/xl (56)
- Инпуты: input/sm (40), input/md (48), input/lg (56)
- Контейнеры: container/content (1200), container/form (850), container/narrow (768), container/page (1440)

**Opacity (`opacity/`):**
0, 5, 6, 8, 10, 12, 16, 20, 25, 30, 38, 50, 60, 72, 80, 90, 100

---

## 2. Текстовые стили

Все текстовые стили имеют обязательный префикс `material-theme/`.

| Роль | Стиль в Figma | Шрифт | Размер / Line Height |
|------|---------------|-------|---------------------|
| Display Large | material-theme/display/large | Poppins Medium | 68px / 76px |
| Display Medium | material-theme/display/medium | Poppins Medium | 64px / 72px |
| Display Small | material-theme/display/small | Poppins Medium | 52px / 60px |
| Headline Large | material-theme/headline/large | Poppins Medium | 48px / 56px |
| Headline Medium | material-theme/headline/medium | Poppins Medium | 34px / 42px |
| Headline Small | material-theme/headline/small | Poppins Medium | 26px / 34px |
| Title Large | material-theme/title/large | Poppins Medium | 20px / 28px |
| Title Medium | material-theme/title/medium | Inter Medium | 16px / 24px |
| Title Small | material-theme/title/small | Inter Medium | 14px / 20px |
| Body Large | material-theme/body/large | Inter Regular | 18px / 28px |
| Body Medium | material-theme/body/medium | Inter Regular | 16px / 24px |
| Body Small | material-theme/body/small | Inter Regular | 14px / 22px |
| Label Large | material-theme/label/large | Inter Semi Bold | 16px / 24px |
| Label Medium | material-theme/label/medium | Inter Medium | 13px / 20px |
| Label Small | material-theme/label/small | Inter Semi Bold | 11px / 16px |
| Label Overline | material-theme/label/overline | Inter Semi Bold | 10px / 16px |
| Button Default | material-theme/button/default | Inter Medium | 16px / 24px |

---

## 3. Общие правила сборки мастер-компонентов

### 3.1 Auto Layout обязателен

Абсолютно ВСЕ контейнеры внутри компонентов создаются строго на Auto Layout. Простые фреймы без Auto Layout запрещены.

### 3.2 Привязка к токенам

Все отступы, размеры, скругления и цвета обязаны привязываться к переменным из коллекций, а не задаваться жёсткими значениями.

Привязка цветов:
```javascript
function bindFill(node, variable) {
  const p = { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } };
  node.fills = [figma.variables.setBoundVariableForPaint(p, "color", variable)];
}
```

Привязка числовых токенов:
```javascript
node.setBoundVariable("topLeftRadius", radiusVariable);
node.setBoundVariable("itemSpacing", spacingVariable);
```

### 3.3 Правила адаптивности (Resizing)

- Обёртки и карточки: Width = Fill container, Height = Hug contents
- Текстовые слои: Width = Fill container (с Auto height), либо Hug contents для кнопок
- `layoutSizingHorizontal = "FILL"` — устанавливать ТОЛЬКО ПОСЛЕ добавления ноды в auto-layout родителя

### 3.4 Именование слоёв

Понятные инженерные имена на английском. Запрещены дефолтные `Frame 1234`, `Rectangle 1`.
Примеры: `Header Container`, `Icon / Left`, `Label`, `Helper Text`, `Content Slot`.

---

## 4. ОБЯЗАТЕЛЬНЫЕ СОСТОЯНИЯ КОМПОНЕНТОВ (States)

### 4.1 Правило: Все интерактивные компоненты ОБЯЗАНЫ иметь полный набор состояний

Каждый компонент, с которым пользователь может взаимодействовать, должен иметь варианты для следующих состояний:

| Состояние | Описание | Визуальная реализация |
|-----------|----------|-----------------------|
| **Default** | Базовое состояние покоя | Стандартные цвета и стили компонента |
| **Hover** | Наведение курсора | State Layer overlay 8% opacity цвета `on-*` поверх базового фона |
| **Focus** | Фокус клавиатуры | Stroke 2px `Schemes/Primary` + State Layer 10% opacity |
| **Pressed** | Активное нажатие | State Layer overlay 16% opacity цвета `on-*` |
| **Disabled** | Неактивный элемент | Opacity всего компонента 38% (`opacity/38`), `pointer-events: none` |
| **Error** | Состояние ошибки (для форм) | Stroke 2px `Schemes/Secondary`, текст хинта `Schemes/Secondary` |

### 4.2 Какие состояния обязательны для каких типов компонентов

| Тип компонента | Default | Hover | Focus | Pressed | Disabled | Error |
|----------------|---------|-------|-------|---------|----------|-------|
| Button (все виды) | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Form/Input | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Form/Textarea | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Form/Select | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Add Button | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Card (все виды) | ✅ | ✅ | — | — | — | — |
| Accordion Header | ✅ | ✅ | ✅ | ✅ | — | — |
| Nav Link | ✅ | ✅ | ✅ | ✅ | — | — |
| Toggle / Switch | ✅ | ✅ | ✅ | — | ✅ | — |
| Dynamic List Item | ✅ | ✅ | — | — | — | — |

### 4.3 Реализация State Layer

State Layer реализуется через полупрозрачный прямоугольник (Frame) поверх контента компонента:

```
Frame "State Layer"
├── layoutSizingHorizontal: "FILL"
├── layoutSizingVertical: "FILL"
├── fill: Schemes/On Primary (или соответствующий on-* токен)
├── opacity: opacity/8 (hover) | opacity/10 (focus) | opacity/16 (pressed)
└── поверх всего контента (последний child в Z-order)
```

Цвет оверлея всегда соответствует `on-*` паре текущего элемента:
- Для Primary-кнопки → `Schemes/On Primary`
- Для Surface-карточки → `Schemes/On Surface`
- Для Secondary-элемента → `Schemes/On Secondary`

### 4.4 Доступность (EAA 2025)

- Все `Focus` состояния должны иметь видимый контур (outline/stroke 2px `Schemes/Primary`) для соблюдения WCAG 2.2 AA
- Контрастность текста к фону: не менее 4.5:1 (стандартный), 3:1 (крупный текст и UI-элементы)
- Все интерактивные элементы доступны по Tab, активируются Space / Enter

---

## 5. Спецификация ключевых мастер-компонентов

### 5.1 Поле ввода (Form/Input)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Структура | Auto Layout Vertical | — |
| Gap (label → input → hint) | 4px | `spacing/4` |
| Width | Fill container | — |

**Label Row** (Horizontal Auto Layout):
- Label: стиль `material-theme/label/small` (Inter Semi Bold 11px), цвет: `Schemes/On Surface Variant`
- Required Mark: текст `*`, цвет: `Schemes/Secondary`

**Input Container** (Horizontal Auto Layout):
- Height: 48px | `sizing/input/md`
- Padding-x: 16px | `spacing/16`
- Gap: 8px | `spacing/8`
- Radius: 12px | `radius/base`
- Background: `Schemes/Surface Container Lowest`
- Stroke: 1px `Schemes/Outline Variant`
- Placeholder: стиль `material-theme/body/medium`, цвет `Schemes/Outline`
- Value: стиль `material-theme/body/medium`, цвет `Schemes/On Surface`

**Helper Row** (Horizontal Auto Layout):
- Hint: стиль `material-theme/label/small`, цвет `Schemes/Outline`

**Variants (State):** Default, Hover, Focus, Error, Disabled
**Component Properties:** Label (TEXT), Placeholder (TEXT), Hint (TEXT), isRequired (BOOLEAN)

Изменения по состояниям:
- **Focus:** stroke Input Container → 2px `Schemes/Primary`
- **Error:** stroke → 2px `Schemes/Secondary`, hint text → `Schemes/Secondary`, текст: "This field is required"
- **Disabled:** opacity всего компонента → 38%

---

### 5.2 Поле ввода многострочное (Form/Textarea)

Идентично Form/Input, за исключением:
- Height Input Container: 120px (вместо 48px)
- Padding-y: 12px | `spacing/12`
- Текст: textAutoResize = "HEIGHT", layoutSizingVertical = "FILL"
- Placeholder: "Enter detailed description..."

**Variants (State):** Default, Focus, Error

---

### 5.3 Выпадающий список (Form/Select)

Идентично Form/Input по структуре, с дополнениями:
- Value вместо Placeholder: стиль `material-theme/body/medium`, цвет `Schemes/Outline` (placeholder) или `Schemes/On Surface` (выбранное)
- Chevron Down: вектор 20x20, stroke `Schemes/On Surface Variant`, 2px, strokeCap ROUND
- primaryAxisAlignItems: SPACE_BETWEEN (текст слева, шеврон справа)

**Component Properties:** Label (TEXT), Value (TEXT), Hint (TEXT), isRequired (BOOLEAN)

---

### 5.4 Кнопка добавления (Add Button)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Horizontal, center-center | — |
| Height | 48px | `sizing/button/lg` |
| Stroke | 1px dashed `Schemes/Outline Variant` | dashPattern: [6, 4] |
| Radius | 12px | `radius/base` |
| Fill | none (transparent) | — |
| Plus Icon | 20x20, stroke 2px `Schemes/Primary` | — |
| Label | стиль `material-theme/label/large`, цвет `Schemes/Primary` | — |

**Component Properties:** Label (TEXT)

---

### 5.5 Бейдж номера секции (Badge/Number)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Size | 32x32px fixed | — |
| Layout | Horizontal, center-center | — |
| Radius | 9999px | `radius/full` |
| Fill | `Schemes/Surface` | — |
| Stroke | 2px `Schemes/Primary` | — |
| Number | Inter Medium 12px, цвет `Schemes/Primary` | — |

**Component Properties:** Number (TEXT)

---

### 5.6 Аккордеон секции конструктора (Section/Accordion)

Главный компонент формы создания кейсов.

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Vertical, gap 0 | — |
| Width | 850px | `sizing/container/form` |
| Radius | 20px | `radius/2xl` |
| Fill | `Schemes/Surface` | — |
| Stroke | 1px `Schemes/Outline Variant` | — |
| Clip content | true | — |

**Section Header** (Horizontal, height 72px, padding-x 24px, SPACE_BETWEEN):
- Left Content (Horizontal, gap 14px, center):
  - Badge/Number instance (32x32)
  - Titles Column (Vertical, gap 2px):
    - Section Title: стиль `material-theme/title/medium`, цвет `Schemes/On Surface`
    - Section Subtitle: стиль `material-theme/label/small`, цвет `Schemes/Outline`
- Chevron icon (24x24, stroke `Schemes/On Surface Variant`, 2px, ROUND)

**Section Body** (Vertical, padding 0/24/24/24, gap 20px):
- Divider: 1px height, fill `Schemes/Outline Variant`, width FILL
- Content Slot: Vertical auto-layout, gap 16px, для размещения полей формы

**Variants:** Expanded × Status
- `Expanded=True, Status=Empty` — Body visible, badge default
- `Expanded=False, Status=Empty` — Body hidden
- `Expanded=True, Status=In Progress` — Body visible
- `Expanded=False, Status=Completed` — Body hidden, badge green fill

**Component Properties:** Title (TEXT), Subtitle (TEXT)

---

### 5.7 Карточка метрики (Card/Metric)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Vertical | — |
| Padding | 20px all | `spacing/20` |
| Gap | 8px | `spacing/8` |
| Radius | 12px | `radius/base` |
| Fill | `Schemes/Surface Variant` | — |
| Width | Fill container | — |

- Metric Value: стиль `material-theme/headline/large` (Poppins Medium 48px), цвет `Schemes/Primary`
- Description: стиль `material-theme/body/small` (Inter Regular 14px), цвет `Schemes/On Surface Variant`

**Component Properties:** Value (TEXT), Description (TEXT)

---

### 5.8 Поле URL Slug (URL Slug Field)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Vertical, gap 4px | `spacing/4` |
| Input Container | height 48px, padding-x 16px, radius 12px | `radius/base` |
| Fill | `Schemes/Surface Container Lowest` | — |
| Stroke | 1px `Schemes/Outline Variant` | — |

- Prefix: `ux42.studio/case/`, стиль `material-theme/body/medium`, цвет `Schemes/Outline`
- Slug Value: стиль `material-theme/body/medium`, цвет `Schemes/On Surface`, Fill container

**Component Properties:** Slug (TEXT)

---

### 5.9 Элемент динамического списка (Dynamic List Item)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Horizontal, SPACE_BETWEEN, center | — |
| Height | 48px | — |
| Padding | 16px left, 12px right | — |
| Radius | 12px | `radius/base` |
| Fill | `Schemes/Surface Container Lowest` | — |
| Stroke | 1px `Schemes/Outline Variant` | — |

- Item Text: стиль `material-theme/body/medium`, цвет `Schemes/On Surface`, Fill container
- Delete Icon: X-крест 20x20, stroke `Schemes/Outline`, 1.5px, ROUND

**Component Properties:** Text (TEXT)

---

### 5.10 Хлебные крошки (Breadcrumb Navigation)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Horizontal, gap 8px | `spacing/8` |

- Links: стиль `material-theme/body/medium`, цвет `Schemes/Primary`
- Separators: текст `/`, цвет `Schemes/Outline`
- Current page: цвет `Schemes/On Surface` (не ссылка)

---

### 5.11 Кнопка сохранения (Save Button)

| Свойство | Значение | Токен |
|----------|----------|-------|
| Layout | Horizontal, center-center | — |
| Padding | 14px vertical, 32px horizontal | — |
| Radius | 12px | `radius/base` |
| Fill | `Schemes/Primary` | — |
| Label | стиль `material-theme/label/large`, цвет `Schemes/On Primary` | — |

**Component Properties:** Label (TEXT)

---

## 6. Инструкция для ИИ-агента

### 6.1 Порядок создания компонентов

Строго в порядке зависимостей: **Атомы → Молекулы → Организмы**.

**Атомы:** Form/Input, Form/Textarea, Form/Select, Add Button, Badge/Number, Save Button
**Молекулы:** Card/Metric, URL Slug Field, Dynamic List Item, Breadcrumb Navigation
**Организмы:** Section/Accordion

### 6.2 Обязательная проверка переменных

Перед использованием переменной ИИ-агент ОБЯЗАН:
1. Получить все коллекции: `figma.variables.getLocalVariableCollectionsAsync()`
2. Найти переменную по точному имени: итерировать `variableIds` коллекции
3. НЕ угадывать имена — использовать только реальные имена из файла

### 6.3 Обязательная проверка текстовых стилей

1. Получить стили: `figma.getLocalTextStylesAsync()`
2. Искать с префиксом: `material-theme/body/medium`, НЕ `body/medium`
3. Применять через: `node.textStyleId = style.id`

### 6.4 Component Properties

- Использовать инженерные имена: `isRequired: boolean`, НЕ `Star Icon: Yes/No`
- `componentPropertyReferences` привязывать ПОСЛЕ `appendChild` в component set
- ID свойств содержат `#` суффикс — искать через `startsWith`

### 6.5 Верификация

После создания компонента обязательно:
1. Логировать ключевые свойства в console
2. Делать `await node.screenshot()` для визуальной проверки
3. Проверять что все текстовые стили применились (не null)
4. Проверять что все переменные привязались