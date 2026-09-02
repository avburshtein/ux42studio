# 🚀 Автоматизация создания дизайн-системы в Figma

**Вам НЕ нужно создавать всё вручную!** Есть несколько способов автоматизировать процесс.

---

## 🎯 Метод 1: Импорт Design Tokens (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Установите плагин в Figma

Выберите один из этих плагинов:

1. **Tokens Studio for Figma** (бывший Figma Tokens) ⭐ ЛУЧШИЙ ВАРИАНТ
   - Plugins → Browse plugins → "Tokens Studio"
   - Поддерживает импорт JSON
   - Создаёт Variables и Styles автоматически

2. **Design Tokens** by Jan Six
   - Plugins → Browse plugins → "Design Tokens"
   - Простой импорт/экспорт

### Шаг 2: Импортируйте токены

```bash
# У вас уже есть готовый файл:
/design-tokens.json
```

**В Figma:**
1. Откройте ваш Figma файл
2. Plugins → Tokens Studio for Figma
3. Load from → JSON
4. Выберите `/design-tokens.json`
5. Нажмите **Import**

✅ **Готово!** Все цвета, spacing, shadows будут созданы автоматически!

---

## 🎨 Метод 2: Импорт из CSS (для Figma Dev Mode)

### Если у вас Figma Enterprise/Professional:

1. Откройте **Dev Mode** в Figma
2. Подключите Git репозиторий
3. Figma автоматически прочитает `/src/styles/theme.css`
4. Все CSS переменные станут доступны в Inspect

---

## 🔄 Метод 3: Используйте плагин для импорта из кода

### Style Dictionary (для опытных пользователей)

```bash
# 1. Установите Style Dictionary
npm install -g style-dictionary

# 2. Создайте config (уже готов в проекте)
# 3. Запустите билд
style-dictionary build

# 4. Импортируйте в Figma через Tokens Studio
```

---

## 📦 Метод 4: Копирование из живого сайта

### Используйте плагины для импорта с сайта:

1. **html.to.design** ⭐ ОЧЕНЬ УДОБНЫЙ
   - Plugins → Browse plugins → "html.to.design"
   - Import from URL → введите localhost:5173
   - Выберите нужные элементы
   - Импорт со всеми стилями!

2. **Figma Import**
   - Импортирует HTML/CSS напрямую

### Как использовать:

```bash
# 1. Запустите ваш сайт локально
npm run dev

# 2. В Figma:
Plugins → html.to.design
→ Import from URL: http://localhost:5173
→ Select elements (кнопки, карточки, формы)
→ Import

# ✅ Компоненты импортируются со всеми стилями!
```

---

## 🎭 Метод 5: Figma Community (найти похожий)

### Используйте готовые шаблоны как основу:

1. Откройте **Community** в Figma
2. Найдите: "Design System Template" или "UI Kit"
3. Дублируйте понравившийся
4. Замените цвета/шрифты на свои из `/design-tokens.json`

**Рекомендуемые шаблоны:**
- "Material Design 3 - Design Kit"
- "Ant Design System"
- "Carbon Design System"

Потом просто поменяйте цвета на свои!

---

## ⚡ Метод 6: Полуавтоматический (самый быстрый)

### Используйте готовые сниппеты:

1. **Создайте Variables одной командой:**

Откройте в Figma: **Plugins → Create Variables from JSON**

```json
Скопируйте секцию "color" из /design-tokens.json
```

2. **Создайте Text Styles скриптом:**

Plugins → **Scripter** → вставьте:

```javascript
// Создание Text Styles
const styles = [
  {name: "H1/Desktop", fontSize: 52, fontFamily: "Poppins", fontWeight: "Medium"},
  {name: "H1/Mobile", fontSize: 32, fontFamily: "Poppins", fontWeight: "Medium"},
  {name: "H2", fontSize: 42, fontFamily: "Poppins", fontWeight: "Medium"},
  {name: "Body", fontSize: 16, fontFamily: "Inter", fontWeight: "Regular"}
];

styles.forEach(s => {
  const style = figma.createTextStyle();
  style.name = s.name;
  style.fontSize = s.fontSize;
  style.fontName = {family: s.fontFamily, style: s.fontWeight};
});
```

---

## 🏆 РЕКОМЕНДУЕМЫЙ WORKFLOW (5-10 минут)

### ⚠️ Важно понимать разницу:

- **Design Tokens** → Создаёт только **стили** (Variables, цвета, spacing)
- **html.to.design** → Импортирует готовые **компоненты** (кнопки, карточки)
- **КОМБО** → Даёт и стили, и компоненты! ⭐

📚 Подробное сравнение: **[FIGMA_METHODS_COMPARISON.md](./FIGMA_METHODS_COMPARISON.md)**

---

### Вариант А: Только стили (для ручной работы)

```
1. Установите плагин "Tokens Studio for Figma"
2. Импортируйте /design-tokens.json
3. Создайте компоненты вручную используя импортированные стили
✅ Время: 2 мин импорт + 30 мин компоненты = 32 мин
```

### Вариант Б: Только компоненты (для быстрого старта)

```
1. npm run dev (запустить сайт)
2. Установите плагин "html.to.design"
3. Импортируйте элементы с localhost:5173
4. Конвертируйте в Figma Components
✅ Время: 5 мин импорт + 10 мин компоненты = 15 мин
```

### Вариант В: Для профессионалов

```
1. Используйте Figma Dev Mode
2. Подключите Git репозиторий
3. Figma сама прочитает стили из кода
4. Используйте в дизайнах
✅ Готово!
```

---

## 📋 Что у вас уже есть готового:

✅ `/design-tokens.json` - готовый файл со всеми токенами  
✅ `/src/styles/theme.css` - CSS переменные  
✅ `/FIGMA_GUIDE.md` - руководство на случай ручного создания  
✅ `/FIGMA_CHEATSHEET.md` - быстрые значения для копирования

---

## 🎯 Что делать ПРЯМО СЕЙЧАС:

### Вариант 1: Импорт токенов (2 минуты)

```
1. Откройте Figma
2. Plugins → Tokens Studio for Figma (установить)
3. Load from JSON → выберите /design-tokens.json
4. Import
```

### Вариант 2: Импорт с сайта (5 минут)

```
1. npm run dev (запустить сайт)
2. Figma → Plugins → html.to.design (установить)
3. Import from URL: http://localhost:5173
4. Выберите Button, Card, Input
5. Import
```

### Вариант 3: Найти шаблон (3 минуты)

```
1. Figma Community → "Design System Template"
2. Дублировать любой понравившийся
3. Заменить цвета на #0b6e4f и #2c5a07
4. Готово!
```

---

## ❓ Частые вопросы

### Q: У меня нет Figma Professional. Что делать?

**A:** Используйте **Tokens Studio** (работает на Free плане) или **html.to.design**

### Q: Плагин не видит design-tokens.json

**A:** 
1. Скопируйте содержимое файла
2. В плагине выберите "Paste JSON"
3. Вставьте содержимое
4. Import

### Q: Хочу всё-таки создать вручную для обучения

**A:** Отлично! Используйте **[FIGMA_GUIDE.md](./FIGMA_GUIDE.md)** - там пошаговые инструкции

### Q: Какой метод самый быстрый?

**A:** **html.to.design** - 5 минут, и у вас готовые компоненты с сайта в Figma!

---

## 🎁 Бонус: Видео-инструкции

### Как импортировать Design Tokens:
1. YouTube → "Tokens Studio for Figma tutorial"
2. YouTube → "Import design tokens into Figma"

### Как импортировать с сайта:
1. YouTube → "html.to.design tutorial"
2. YouTube → "Import website to Figma"

---

## 📚 Связанные документы

- [design-tokens.json](./design-tokens.json) - 🔥 Готовый файл для импорта
- [FIGMA_GUIDE.md](./FIGMA_GUIDE.md) - Ручное создание (если нужно)
- [FIGMA_CHEATSHEET.md](./FIGMA_CHEATSHEET.md) - Быстрые значения

---

**✨ Выберите любой метод и создайте дизайн-систему за 5-10 минут!** 🚀