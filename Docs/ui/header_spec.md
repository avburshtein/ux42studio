Вот подробная спецификация компонента Header:

Master Component Spec: Header
Component set ID: 245:1632
Section: Navigation
Variant property: Property 1 → Default | Breadcrumb
Instance swap property: logo#245:2 → default component 87:1949 (logo / Variant=Default)

1. Общая структура (оба варианта идентичны)
Параметр	Значение
Width	1200px (FIXED)
Height	HUG (auto по содержимому)
Layout	HORIZONTAL (flex-row)
Gap	0
Padding	16px 64px (top/bottom 16, left/right 64)
Main axis	SPACE_BETWEEN (justify-content: space-between)
Cross axis	CENTER (align-items: center)
Clips content	false
Три зоны: левая (навигация), центр (лого), правая (переключатель темы + CTA).

2. Фон (Fill)
Текущее состояние: используется Paint Style "hero block gradient" (StyleID: S:c7142e1202a796fdd999961b61e30d4e8f59e1c3).

Содержимое стиля: Linear Gradient с двумя стопами:

Stop	Позиция	Переменная (Variable)	Light значение	Opacity
0	0%	Schemes/Background (VariableID:14:1624)	#F7FAF5	1.0
1	100%	State Layers/Background/Opacity-08 (VariableID:14:1786)	#F7FAF5	0.08
Направление градиента: gradientTransform: [[0.5,0.5,0],[-0.25,0.25,0.5]] — от left-center к top-right.

CSS-эквивалент:

css code
background: linear-gradient(
  315deg,
  var(--md-sys-color-background) 0%,
  color-mix(in srgb, var(--md-sys-color-background) 8%, transparent) 100%
);
⚠️ Рекомендация для верстки: Стиль hero block gradient содержит привязки к переменным внутри стопов градиента. В CSS реализовать через CSS-переменные --md-sys-color-background (#F7FAF5 light / #101412 dark). Градиент по сути создает лёгкий fade — от полностью непрозрачного Background к почти полностью прозрачному (8%) Background. На практике это делает фон слегка полупрозрачным для работы backdrop-filter.

3. Эффекты (Effects)
Текущее состояние: используется Effect Style "Effects/Blur/Glass Heavy" (StyleID: S:fc595e524c1d02bc50b1b4b3432ac804849856cf).

Содержит два эффекта:

3a. Glass (Backdrop Blur)
Параметр	Значение
Type	GLASS (backdrop-filter)
Blur radius	40px
Refraction	0.8
Depth	20
Light angle	-45°
Light intensity	0.8
Dispersion	0.5
Splay	0
CSS-эквивалент:

css code
backdrop-filter: blur(40px);
-webkit-backdrop-filter: blur(40px);
Glass в Figma — это расширенный backdrop blur с эффектами стекла (рефракция, светотень). В CSS полностью воспроизвести невозможно, но backdrop-filter: blur(40px) даёт близкий результат. Полупрозрачный фон (градиент с opacity 8% на втором стопе) обеспечивает видимость контента позади header.

3b. Drop Shadow
Параметр	Значение
Type	DROP_SHADOW
Color	rgba(0, 0, 0, 0.10)
Offset X	8px
Offset Y	8px
Blur	20px
Spread	0px
CSS-эквивалент:

css code
box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.10);
Комбинированный CSS для header:

css code
.header {
  background: linear-gradient(
    315deg,
    var(--md-sys-color-background) 0%,
    color-mix(in srgb, var(--md-sys-color-background) 8%, transparent) 100%
  );
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.10);
}
4. Variant: Default
Левая зона — Frame "Frame 52":

Layout: HORIZONTAL, gap: 24px, align: CENTER
Sizing: FIXED width / HUG height
Содержит: Nav Links frame
Nav Links:

Параметр	Значение
Layout	HORIZONTAL, gap: 24px
Sizing	HUG / HUG
Nav Link — инстансы компонента Nav Link (component set 96:299):

Свойство	Значение
Варианты State	Default, Hovered, Active
Layout	HORIZONTAL, padding: 10px 0px
Clipping	true
Текст 1	"Work"
Текст 2	"About"
Шрифт	Inter Regular 16/24
Цвет текста	Variable: Schemes/On Surface Variant (VariableID:14:1629)
Light: #44474B / Dark: #C5C6CC
⚠️ Текст навлинков использует Schemes/On Surface Variant напрямую через variable binding (не стиль). В CSS: color: var(--md-sys-color-on-surface-variant).

Центр — Logo (Instance Swap):

Параметр	Значение
Instance swap prop	logo#245:2
Default component	87:1949 (logo / Variant=Default)
Component set	logo (87:1948), варианты: Default, Alternate
Preferred values	ComponentKey: 1bd6a236edf3de4acc81e86ce8df8ce51cddcf82
Size	89×64px
Layout	HORIZONTAL, padding: 10px all sides
Sizing	HUG / HUG
Правая зона — Frame "Frame 51":

Layout: HORIZONTAL, gap: 24px
Primary: MAX (justify-content: flex-end), Counter: CENTER
Sizing: HUG / HUG
Содержит два toggle-контейнера:

4a. Theme Switcher
Wrapper: Frame "toggle" — VERTICAL, counter: MAX, HUG/HUG

Switcher / Toggle — инстанс компонента (component set 87:1745):

Свойство	Значение
Текущий вариант	Type=Mode Button, Value=Light
Другие варианты Type	Subscription Toggle, Toggle Switch
Другие варианты Value	Monthly, Dark, Light, Yearly, On, Off
Size	48×48px
Layout	HORIZONTAL, padding: 4px 12px
SizingH	HUG, SizingV: FIXED (48px)

Light: #E4E2E3 / Dark: #353536
Corner radius	48px (полный круг)
Иконка	sun icon, 24×24px
⚠️ Stroke привязан к variable Schemes/Surface Container Highest. CSS: border: 1px solid var(--md-sys-color-surface-container-highest).

4b. CTA Button
Wrapper: Frame "toggle" — VERTICAL, counter: MAX, HUG/HUG

Button / Ghost — инстанс компонента (component set 34:24):

Свойство	Значение
Текущий вариант	State=Enabled, Size=Large, Arrow=False
Варианты State	Enabled, Hovered, Pressed
Варианты Size	Large, Small
Варианты Arrow	False, Right, Left
Text property	Label#34:0 = "Hire me"
Size	123×48px
Layout	HORIZONTAL, padding: 12px 16px
Sizing	FIXED / FIXED
Corner radius	8px
Шрифт	Inter Medium 16/24
Text style	material-theme/button/default (StyleID: S:e3ce88f8e2e4615dc05d753210ffcdb74749eedd)
Цвет текста	Variable: Schemes/Surface Tint (VariableID:14:1608)
Light: #056C4D / Dark: #83D7B1
⚠️ Стиль vs Variable: Текст использует text style material-theme/button/default для типографики (Inter Medium 16/24) + variable binding для цвета (Schemes/Surface Tint). CSS:

css code
font: 500 16px/24px 'Inter', sans-serif;
color: var(--md-sys-color-surface-tint);
5. Variant: Breadcrumb
Идентична Default по фону, эффектам, центру (logo) и правой зоне (toggle + CTA).

Отличается только левая зона — Frame "Frame 52":

Layout: HORIZONTAL, gap: 24px, HUG/HUG, align: CENTER
Содержит:

5a. Back Button
Button / Ghost инстанс, variant: State=Enabled, Size=Large, Arrow=Left:

Свойство	Значение
Label	"Back"
Arrow	Left (иконка arrow-left, component 44:167, 24×24)
Gap (icon↔label)	8px
Padding	12px 16px
Corner radius	8px
Шрифт	Inter Medium 16/24
Цвет текста	Variable: Schemes/On Surface Variant (VariableID:14:1629)
Light: #44474B / Dark: #C5C6CC
⚠️ Текст кнопки Back использует On Surface Variant, а не Surface Tint как у "Hire me". Это намеренно — кнопка "Back" визуально приглушена, CTA ярче.

5b. Breadcrumb Navigation
Инстанс компонента Breadcrumb Navigation (161:392):

Свойство	Значение
Layout	HORIZONTAL, gap: 8px
Sizing	HUG / HUG
Текстовые элементы:

Элемент	Текст по умолчанию	Шрифт	Цвет (Variable)	Light hex	Dark hex
Link 1	"Portfolio"	Inter Regular 16/24	Schemes/Primary (14:1607)	#00543B	#83D7B1
Separator	"/"	Inter Regular 16/24	Schemes/Outline (14:1630)	#75777C	#8F9196
Link 2	"Cases"	Inter Regular 16/24	Schemes/Primary (14:1607)	#00543B	#83D7B1
Separator	"/"	Inter Regular 16/24	Schemes/Outline (14:1630)	#75777C	#8F9196
Current	"New Case"	Inter Regular 16/24	Schemes/On Surface (14:1627)	#1B1B1D	#E4E2E3
Все тексты breadcrumb используют text style material-theme/body/medium (StyleID: S:fd7ac17ea9662a5940f23558ea37b9235e5f9c85), но цвета привязаны через variable bindings. CSS:

css code
.breadcrumb-link { color: var(--md-sys-color-primary); }
.breadcrumb-separator { color: var(--md-sys-color-outline); }
.breadcrumb-current { color: var(--md-sys-color-on-surface); }
6. Сводная таблица: стили → токены
Что используется	Стиль (StyleID)	Рекомендация для CSS
Фон	Paint Style hero block gradient	linear-gradient(315deg, var(--md-sys-color-background), ...) + backdrop-filter: blur(40px)
Эффекты	Effect Style Effects/Blur/Glass Heavy	backdrop-filter: blur(40px) + box-shadow: 8px 8px 20px rgba(0,0,0,0.10)
Текст кнопок	Text Style material-theme/button/default	font: 500 16px/24px 'Inter'
Текст breadcrumb	Text Style material-theme/body/medium	font: 400 16px/24px 'Inter'
Цвет навлинков	Variable Schemes/On Surface Variant	var(--md-sys-color-on-surface-variant)
Цвет CTA	Variable Schemes/Surface Tint	var(--md-sys-color-surface-tint)
Цвет Back	Variable Schemes/On Surface Variant	var(--md-sys-color-on-surface-variant)
Цвет ссылок BC	Variable Schemes/Primary	var(--md-sys-color-primary)
Цвет разделителей BC	Variable Schemes/Outline	var(--md-sys-color-outline)
Цвет текущей BC	Variable Schemes/On Surface	var(--md-sys-color-on-surface)
Border switcher	Variable Schemes/Surface Container Highest	var(--md-sys-color-surface-container-highest)
7. Дочерние компоненты (dependency tree)
Компонент	ID Set	Варианты
Nav Link	96:299	State: Default, Hovered, Active
logo	87:1948	Variant: Default, Alternate
Switcher / Toggle	87:1745	Type: Subscription Toggle / Mode Button / Toggle Switch × Value: Monthly / Dark / Light / Yearly / On / Off
Button / Ghost	34:24	State: Enabled / Hovered / Pressed × Size: Large / Small × Arrow: False / Right / Left
Breadcrumb Navigation	161:392	(без вариантов, один компонент)
arrow-left (icon)	44:167	(используется внутри Button/Ghost Arrow=Left)
Спека готова! Она покрывает полную структуру, все привязки к переменным, стили и точные CSS-эквиваленты. Если нужно что-то уточнить или дополнить — дай знать.