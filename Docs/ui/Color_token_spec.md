📋 Спецификация компонента «Color Tokens» — для фронтенд-верстки
1. Общие сведения
Назначение: Блок отображает цветовую палитру дизайн-системы проекта на публичной странице портфолио-кейса. Данные приходят из админки, где пользователь задаёт две цветовые роли (Primary и Accent) в двух схемах (Light и Dark) с автоматическим расчётом контрастности WCAG.

Фрейм в Figma: 
 (1072 × 586 px)

2. Структура верхнего уровня
Code block
Color tokens (VERTICAL, gap=24, width=100% от родителя, height=auto)
├── Paragraph (VERTICAL, width=100%, height=auto)
│   └── "COLOR TOKENS" — заголовок-лейбл
└── Color tokens wrapper (HORIZONTAL, gap=24, width=100%, height=auto)
    └── Light Scheme (карточка с токенами — видна 1 из 2 схем)
Примечание: В Figma фрейм Color tokens wrapper (280:210) — HORIZONTAL с gap=24, но в нём видна только одна карточка (Light или Dark), вторая подменяется переключателем. В верстке это один контейнер, содержимое которого меняется при toggle.

3. Заголовок «COLOR TOKENS»
Свойство	Значение
Текст	COLOR TOKENS (uppercase)
Шрифт	Inter Semi Bold
Размер	11px
Line height	16px
Letter spacing	0.5px
Цвет	#75777C (токен Outline)
text-transform	uppercase
4. Карточка схемы (Light Scheme / Dark Scheme)
Свойство	Значение
Layout	VERTICAL (flex-direction: column)
Width	100% (fill parent)
Height	auto (hug content)
Background	#FFFFFF (токен Surface Container Lowest)
Border	1px solid rgba(113, 118, 114, 0.1) — токен Tertiary @10% opacity
Border radius	12px (токен radius/base)
Padding	20px top / 20px right / 24px bottom / 20px left
Gap (внутренний)	12px между дочерними элементами
5. Переключатель схемы (Scheme Toggle)
Горизонтальный ряд в верху карточки:

Свойство	Значение
Layout	HORIZONTAL (flex-direction: row)
Gap	32px
Align	center по вертикали
5.1 Лейбл
Свойство	Значение
Текст	Dark Scheme
Шрифт	Inter Medium
Размер	16px
Цвет	#1B1B1D (токен On Surface)
5.2 Toggle (Switcher)
Свойство	Значение
Размер трека	44 × 24 px
Background трека (OFF)	#C5C6CC (токен Outline Variant)
Background трека (ON)	#00543B (токен Primary) — при активации Dark Scheme
Border radius трека	12px (полностью скруглённый)
Padding трека	2px (all sides)
Handle	Круг 20 × 20 px
Handle fill	#FFFFFF
Анимация	Handle смещается left↔right при toggle
Логика: При toggle=OFF отображается Light Scheme, при toggle=ON — Dark Scheme. Меняются все цвета свотчей внутри карточки на значения из Dark-палитры.

6. Spacer
Между toggle и токенами — пустой spacer 8px высотой (уже учтён в gap=12, но добавляет дополнительный отступ).

7. Semantic Tokens (верхний блок — 4 колонки)
Контейнер:

Свойство	Значение
Layout	VERTICAL, gap=2
Width	100% (fill)
Row (ряд из 4 колонок):

Свойство	Значение
Layout	HORIZONTAL, gap=4
Width	100% (fill), каждая колонка — 25% (flex: 1)
Height	148px
7.1 Колонка (пара «Color + On Color»)
Каждая колонка — VERTICAL, gap=2, width=flex-1, height=fill.

Верхний свотч (основной цвет):

Свойство	Значение
Layout	HORIZONTAL, justify: space-between, align: flex-end
Width	100% (fill)
Height	112px (flex: 1, растягивается)
Padding	8px (all sides)
Border radius	0 (нет скругления — вплотную стыкуется с соседними)
Background	Цвет токена (см. таблицу ниже)
Содержимое верхнего свотча:

Название токена (нижний-левый угол):

Шрифт: Inter Semi Bold, 10px, line-height 16px, letter-spacing 0.5px
Цвет: On-цвет токена (обычно #FFFFFF)
Контраст (нижний-правый угол):

Шрифт: Inter Medium, 10px
Цвет: тот же On-цвет, но с opacity 0.7 (70%)
Формат: "9.0:1 AAA" или "6.5:1 AA"
Нижний свотч (On-цвет):

Свойство	Значение
Layout	VERTICAL
Width	100% (fill)
Height	34px (фиксированная)
Padding	8px (all sides)
Background	On-цвет токена
Border	1px solid #C5C6CC (Outline Variant) — только если фон светлый/белый
Border radius	0
Текст: Название On-токена, Inter Semi Bold 10px, цвет основного токена (инвертировано)
7.2 Данные Semantic Tokens — Light Scheme
#	Верхний свотч	Fill	On-цвет (нижний)	Fill On	Контраст	Уровень
1	Primary	#00543B	On Primary	#FFFFFF	9.0:1	AAA
2	Secondary	#B12A33	On Secondary	#FFFFFF	6.5:1	AA
3	Tertiary	#5B5F5C	On Tertiary	#FFFFFF	6.5:1	AA
4	Error	#8A5100	On Error	#FFFFFF	6.5:1	AA
On-свотчи с белым фоном получают border 1px solid #C5C6CC (Outline Variant), чтобы не сливаться с фоном карточки.

8. Palette Tokens (второй блок — Container-пары)
Точно такая же структура, как Semantic Tokens: VERTICAL gap=2 → Row HORIZONTAL gap=4 → 4 колонки.

Единственное отличие — gap между верхним и нижним свотчем внутри колонки: 4px (вместо 2px у Semantic).

8.1 Данные Palette Tokens — Light Scheme
#	Верхний свотч	Fill	Текст свотча цвет	On-Container	Fill On	Текст On	Контраст
1	Primary Container	#0B6E4F	#98EDC6	On Primary Container	#98EDC6	#0B6E4F	4.6:1 AA
2	Secondary Container	#FF6467	#680010	On Secondary Container	#680010	#FF6467	4.6:1 AA
3	Tertiary Container	#FBFFFA	#717672	On Tertiary Container	#717672	#FBFFFA	4.6:1 AA
4	Error Container	#D17D00	#402300	On Error Container	#402300	#D17D00	4.6:1 AA
Важно: В Palette Tokens текст свотча — не белый, а On-*-Container-цвет пары. Контраст-бейджи тоже используют этот цвет @70% opacity. Tertiary Container (#FBFFFA) — почти белый, поэтому имеет border 1px solid #C5C6CC (Outline Variant).

9. Surface Row (Background / Surface / Surface Container)
Свойство	Значение
Layout	HORIZONTAL, gap=4
Width	100% (fill)
Каждый свотч	flex: 1 (3 равные колонки ≈33.3%)
Каждый свотч:

Свойство	Значение
Height	56px
Padding	8px
Border radius	10px (токен radius/md)
Border	1px solid #C5C6CC (Outline Variant) — все три имеют border
Text align	нижний-левый угол
Шрифт	Inter Semi Bold 10px
Цвет текста	#1B1B1D (On Surface)
#	Название	Fill
1	Background	#F7FAF5
2	Surface	#FCF8FA
3	Surface Container	#F0EDEE
10. On Surface Row (4 свотча)
Свойство	Значение
Layout	HORIZONTAL, gap=4
Width	100% (fill)
Каждый свотч	flex: 1 (4 равные колонки = 25%)
Каждый свотч:

Свойство	Значение
Height	56px
Padding	8px
Border radius	10px
Text align	нижний-левый угол
Шрифт	Inter Semi Bold 10px
#	Название	Fill	Цвет текста	Бордер
1	On Surface	#1B1B1D	#FFFFFF	нет
2	On Surface Var.	#44474B	#FFFFFF	нет
3	Outline	#75777C	#FFFFFF	нет
4	Outline Variant	#C5C6CC	#1B1B1D	нет
Правило бордеров на On Surface row: Тёмные свотчи — без бордера. Светлый Outline Variant (#C5C6CC) — тоже без бордера в Figma, но при необходимости можно добавить.

11. Скрытые ряды (НЕ отображаются)
Следующие ряды существуют в Figma, но hidden=true — в верстке их выводить не нужно (по умолчанию):

Surface Container Levels (Lowest / Low / Container / High / Highest) — 5 свотчей
Inverse Surface / Inverse On Surface / Inverse Primary — 3 свотча
Scrim / Shadow — 2 свотча
12. Данные Dark Scheme
При переключении toggle на Dark Scheme, все свотчи меняют цвета на Dark-палитру. Данные из М3:

Semantic Tokens — Dark:

Токен	Fill	On-цвет
Primary	#8CD5B3	#003826
Secondary	#FFB3B1	#680011
Tertiary	#FFFFFF	#2D312E
Error	#FFB86E	#492900
Palette Tokens — Dark:

Токен	Fill	On-Container
Primary Container	#0B6E4F	#98EDC6
Secondary Container	#FF6467	#680010
Tertiary Container	#DFE4DF	#616562
Error Container	#D17D00	#402300
Surface — Dark:

Токен	Fill
Background	#101412
Surface	#131314
Surface Container	#1F1F21
On Surface — Dark:

Токен	Fill
On Surface	#E4E2E3
On Surface Var.	#C5C6CC
Outline	#8F9196
Outline Variant	#44474B
13. Модель данных (из админки)
На основе скриншота админки, данные поступают в формате двух цветовых ролей. Каждая роль содержит:

typescript code
interface ColorRole {
  name: string;              // "Primary" | "Accent" (пользовательское название)
  onColorName: string;       // "onPrimary" | "on-primary"
  light: {
    mainColor: string;       // HEX, напр. "#00543B"
    onColor: string;         // HEX, напр. "#ffffff"
    contrast: number;        // Автовычисляемый, напр. 9.0
  };
  dark: {
    mainColor: string;       // HEX, напр. "#83D7B1"
Маппинг админка → фронт:

В админке задаются только 2 роли (Primary и Accent), но в Figma-фрейме отображается полная палитра M3 (Primary, Secondary, Tertiary, Error + Container-пары + Surfaces). Варианты реализации:

Генерация полной палитры из 2 seed-цветов через Material Color Utilities (рекомендовано)
Хардкод Surface/Outline токенов как фиксированных значений M3, подставляя только Primary и Secondary из админки
14. Адаптивность
По данным из Figma mobile-фрейма и дизайн-системы:

Breakpoint	Поведение
Desktop (≥1200px)	4 колонки в рядах Semantic/Palette, 3 в Surface, 4 в On Surface
Tablet (~768px)	2 колонки (Semantic/Palette переносятся по 2)
Mobile (≤380px)	1 колонка (вертикальная стопка всех свотчей)
15. Сравнение: Figma (эталон) vs текущая реализация (image 1)
На основе 
 видны отличия текущей вёрстки:

Проблема	Figma (правильно)	Текущая вёрстка (image 1)
Структура	Единая карточка с toggle + ряды свотчей	Две отдельные карточки (Primary, Accent)
Toggle	Один переключатель Light/Dark вверху	Нет toggle, Light/Dark показаны оба сразу
Свотчи	Горизонтальные ряды из 4 цветов + On-цвета	Вертикальные пары цветов с HEX-кодами
Контрастность	Бейдж "9.0:1 AAA" внутри свотча	Не отображается
HEX-коды	Не отображаются (только цвет + название)	Показаны HEX-коды
Surface/Outline	Отдельные ряды внизу	Отсутствуют
Количество цветов	18+ видимых свотчей	4 (по 2 на карточку)
16. Чеклист для верстальщика
 Единая карточка с border-radius 12px и border 1px rgba(113,118,114,0.1)
 Toggle Dark/Light вверху карточки (label + switcher 44×24)
 Semantic Tokens: 4 колонки, каждая = большой свотч (112px) + маленький On-свотч (34px), gap=2
 Palette Tokens: 4 колонки аналогичной структуры, gap=4 между свотчами
 Surface row: 3 свотча по 56px с border и radius=10
 On Surface row: 4 свотча по 56px с radius=10
 Контраст-бейджи: Inter Medium 10px, opacity 70%, формат "X.X:1 AA/AAA"
 Все названия токенов: Inter Semi Bold 10px
 Все размеры шрифтов: 10px (свотчи), 11px (заголовок), 16px (toggle label)
 Gap между рядами: 12px (общий gap карточки) + 2px (внутри секций)
 Светлые свотчи (белый/near-white фон) получают border 1px solid #C5C6CC
 Переключатель должен менять все цвета на Dark-палитру одновременно
 Скрытые ряды (Inverse, Scrim, Surface Container Levels) — не рендерить