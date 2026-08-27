# 🔧 Инструкция для коммита

## Быстрый способ

### Вариант 1: Используйте готовый скрипт

```bash
# Сделайте скрипт исполняемым
chmod +x commit.sh

# Запустите скрипт
./commit.sh

# Отправьте на GitHub
git push
```

### Вариант 2: Команды вручную

```bash
# Проверьте статус
git status

# Добавьте все файлы
git add .

# Создайте коммит
git commit -m "Replace figma:asset imports with local SVG images"

# Отправьте на GitHub
git push
```

---

## Подробные команды

```bash
# 1. Проверьте текущий статус
git status

# 2. Добавьте файлы (выберите один вариант):

# Вариант A: Добавить все файлы
git add .

# Вариант B: Добавить только конкретные файлы
git add public/images/ src/imports/HomeDesktop.tsx *.md

# 3. Создайте коммит с описанием
git commit -m "Replace figma:asset imports with local SVG images

✨ Major Changes:
- Create 6 optimized SVG placeholder images
- Replace 22 figma:asset imports in HomeDesktop.tsx
- Add comprehensive migration documentation

✅ Benefits:
- No dependency on figma:asset virtual scheme
- Works on any hosting platform
- Ready for production deployment"

# 4. Отправьте изменения на GitHub
git push
```

---

## Если это первый коммит

```bash
# 1. Инициализируйте Git (если еще не сделано)
git init

# 2. Добавьте все файлы
git add .

# 3. Создайте первый коммит
git commit -m "Initial commit: Ready for deployment"

# 4. Подключите GitHub репозиторий (замените на свой URL)
git remote add origin https://github.com/USERNAME/REPOSITORY.git

# 5. Установите главную ветку
git branch -M main

# 6. Первый push
git push -u origin main
```

---

## Проверка после коммита

```bash
# Проверьте что коммит создан
git log --oneline -1

# Проверьте удаленные репозитории
git remote -v

# Проверьте текущую ветку
git branch
```

---

## После push

Зайдите на GitHub и проверьте что все файлы загружены:
- https://github.com/your-username/your-repo

Если используете:
- **Vercel**: зайдите на vercel.com и импортируйте репозиторий
- **Netlify**: зайдите на netlify.com и подключите репозиторий
- **GitHub Pages**: Settings → Pages → Source: GitHub Actions

---

## Готово! ✅

После push ваш проект будет на GitHub и готов к деплою!
