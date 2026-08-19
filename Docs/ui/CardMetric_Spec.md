Все данные собраны. Вот полная спецификация:

Master Component Spec: Card/Metric
Component set ID: 169:405
Section: Cards
Variant property: State → Default (единственный вариант)
Text properties: 4 штуки (2 активных + 2 неиспользуемых)

1. Component Set (обёртка)
Параметр	Значение
Layout	HORIZONTAL, gap: 16px
Padding	16px all sides
Sizing	HUG / HUG
Corner radius	5px
Clips content	true
Fill	нет
Stroke	нет
ℹ️ Это стандартная обёртка Figma component set — не несёт визуального значения, в CSS не нужна.

2. Variant: State=Default
ID: 161:368 | Size: 280×126px (HUG по высоте)

2a. Layout
Параметр	Значение	Variable binding
Layout	VERTICAL (flex-column)	—
Gap	8px	spacing/8 (VariableID:154:7)
Padding	20px all sides	spacing/20 (VariableID:154:12)
Main axis	MIN (align-items: flex-start)	—
Cross axis	FIXED (width fixed)	—
SizingH	FIXED (280px)	—
SizingV	HUG	—
2b. Background Fill
Параметр	Значение
Fill type	SOLID
Variable	Schemes/Surface Container Lowest (VariableID:14:1651)
Light	#FFFFFF
Dark	#0E0E0F
CSS:

css code
background-color: var(--md-sys-color-surface-container-lowest);
2c. Corner Radius
Параметр	Значение	Variable binding
Border radius	12px (uniform)	radius/base (VariableID:154:30)
CSS:

css code
border-radius: var(--radius-base); /* 12px */
2d. Effects
Effect Style: "Effects/Shadow/Portfolio Card Default" (StyleID: S:c85c72e186a1596afdfe3bc3c70f3491bead8e47)

Параметр	Значение
Type	DROP_SHADOW
Color	rgba(0, 0, 0, 0.06)
Offset X	0px
Offset Y	2px
Blur	12px
Spread	0px
CSS:

css code
box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
ℹ️ Этот shadow совпадает с --shadow-card из globals.css: 0px 2px 12px 0px rgba(0, 0, 0, 0.06). Рекомендуется использовать CSS-переменную var(--shadow-card).

2e. Stroke
Нет. Карточка не имеет бордера.

3. Текстовые элементы
3a. Metric Value (заголовок-метрика)
Node: 161:369 "Metric Value"

Параметр	Значение
Text property	Value#169:35
Default text	"85%"
Component property ref	characters → Value#169:35
SizingH	FILL (stretch)
SizingV	HUG
LayoutAlign	STRETCH
TextAutoResize	HEIGHT
Типографика:

Параметр	Значение
Text Style	material-theme/headline/large (StyleID: S:51e6b60c7dd2fa42c64574c873c5a359d5fbd7a8)
Font	Poppins Medium
Size	48px
Line height	56px
Letter spacing	0px
Align	LEFT / TOP
Цвет текста:

Параметр	Значение
Variable	Schemes/Primary (VariableID:14:1607)
Light	#00543B
Dark	#83D7B1
CSS:

css code
.metric-value {
  font: 500 48px/56px 'Poppins', sans-serif;
  color: var(--md-sys-color-primary);
}
⚠️ В globals.css нет готового text-style токена для headline/large (48/56). Нужно добавить или использовать напрямую. Ближайший зарегистрированный — --text-display-sm: 52px — не совпадает. Рекомендуется добавить в @theme:

css code
--text-headline-lg: 48px;
--text-headline-lg--line-height: 56px;
--text-headline-lg--font-weight: 500;
3b. Description (подпись)
Node: 161:370 "Description"

Параметр	Значение
Text property	Description#169:36
Default text	"Task completion rate"
Component property ref	characters → Description#169:36
SizingH	FILL (stretch)
SizingV	HUG
LayoutAlign	STRETCH
TextAutoResize	HEIGHT
Типографика:

Параметр	Значение
Text Style	material-theme/body/small (StyleID: S:a6ab5c1cc409dc8dfef1337717efe446c25cd444)
Font	Inter Regular
Size	14px
Line height	22px
Letter spacing	0.4px
Align	LEFT / TOP
Цвет текста:

Параметр	Значение
Variable	Schemes/On Surface Variant (VariableID:14:1629)
Light	#44474B
Dark	#C5C6CC
CSS:

css code
.metric-description {
  font: 400 14px/22px 'Inter', sans-serif;
  letter-spacing: 0.4px;
  color: var(--md-sys-color-on-surface-variant);
}
ℹ️ Соответствует токену из globals.css: --text-body-sm: 14px / --text-body-sm--line-height: 22px. Но letter-spacing 0.4px не зарегистрирован в @theme. Рекомендуется добавить --text-body-sm--letter-spacing: 0.4px.

4. Component Properties (сводка)
Property ID	Тип	Default	Привязан к	Статус
Value#169:35	TEXT	"85%"	"Metric Value" → characters	✅ Активен
Description#169:36	TEXT	"Task completion rate"	"Description" → characters	✅ Активен
Value2#169:37	TEXT	"85%"	— (не привязан)	⚠️ Orphan
Description2#169:40	TEXT	"Task completion rate"	— (не привязан)	⚠️ Orphan
State	VARIANT	"Default"	варианты компонента	✅ Активен
⚠️ Value2 и Description2 — осиротевшие свойства. Они не привязаны ни к одному текстовому узлу. Вероятно, остались от удалённого второго варианта. Для чистоты рекомендуется удалить их из component set. В верстке — игнорировать.

5. Сводная таблица: стили → токены
Элемент	Стиль / Style ID	CSS-токен
Фон карточки	Variable Schemes/Surface Container Lowest	var(--md-sys-color-surface-container-lowest)
Тень	Effect Style Effects/Shadow/Portfolio Card Default	var(--shadow-card) = 0px 2px 12px 0px rgba(0,0,0,0.06)
Скругление	Variable radius/base	var(--radius-base) = 12px
Gap	Variable spacing/8	gap: 8px (или var(--spacing-8) если зарегистрировано)
Padding	Variable spacing/20	padding: 20px (или var(--spacing-20))
Текст метрики	Text Style material-theme/headline/large	font: 500 48px/56px 'Poppins'
Цвет метрики	Variable Schemes/Primary	var(--md-sys-color-primary)
Текст описания	Text Style material-theme/body/small	font: 400 14px/22px 'Inter'; letter-spacing: 0.4px
Цвет описания	Variable Schemes/On Surface Variant	var(--md-sys-color-on-surface-variant)
6. Variable Collections используемые
Коллекция	ID	Привязки
material-theme	VariableCollectionId:14:1606	fill (Surface Container Lowest), text fills (Primary, On Surface Variant) — 6 modes (Light, Light HC, Light MC, Dark, Dark HC, Dark MC)
spacing	VariableCollectionId:154:2	gap (8px), padding (20px) — 1 mode (Default)
radius	VariableCollectionId:154:25	border-radius (12px) — 1 mode (Default)
7. Полный CSS-компонент (рекомендация)
css code
.card-metric {
  display: flex;
  flex-direction: column;
  gap: 8px;  /* spacing/8 */
  padding: 20px;  /* spacing/20 */
  background-color: var(--md-sys-color-surface-container-lowest);
  border-radius: var(--radius-base, 12px);
  box-shadow: var(--shadow-card, 0px 2px 12px 0px rgba(0, 0, 0, 0.06));
}
8. Зависимости
Нет дочерних инстансов — компонент полностью самодостаточный (два текстовых узла).

