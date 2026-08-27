# 🔧 Все команды для деплоя

## 📦 Установка и локальная разработка

```bash
# Установка зависимостей (первый раз)
npm install

# Запуск dev сервера (localhost:5173)
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки (localhost:4173)
npm run preview
```

---

## 🔄 Git команды

```bash
# Инициализация (если проект новый)
git init

# Проверка статуса
git status

# Добавить все файлы
git add .

# Коммит
git commit -m "Ready for deployment"

# Подключить GitHub репозиторий
git remote add origin https://github.com/USERNAME/REPO.git

# Проверить удаленные репозитории
git remote -v

# Установить главную ветку
git branch -M main

# Первый push
git push -u origin main

# Последующие push
git push
```

---

## 🚀 Vercel

### Через CLI

```bash
# Установка Vercel CLI (глобально)
npm install -g vercel

# Вход в аккаунт
vercel login

# Деплой (development)
vercel

# Деплой (production)
vercel --prod

# Проверка статуса
vercel ls

# Информация о проекте
vercel inspect
```

### Через веб-интерфейс

```bash
# 1. Запушьте код на GitHub (см. Git команды выше)
git push

# 2. Откройте в браузере:
# https://vercel.com

# 3. Import Project → Выберите репозиторий → Deploy
```

---

## 🌐 Netlify

### Через CLI

```bash
# Установка Netlify CLI (глобально)
npm install -g netlify-cli

# Вход в аккаунт
netlify login

# Инициализация проекта
netlify init

# Деплой (draft)
netlify deploy

# Деплой (production)
netlify deploy --prod

# Проверка статуса
netlify status

# Открыть сайт
netlify open
```

### Через Drag & Drop

```bash
# 1. Соберите проект
npm run build

# 2. Откройте в браузере:
# https://app.netlify.com/drop

# 3. Перетащите папку dist
```

---

## 📄 GitHub Pages

### Автоматический деплой

```bash
# 1. Настройте GitHub Pages:
# Settings → Pages → Source: GitHub Actions

# 2. Просто пушьте код
git add .
git commit -m "Deploy to GitHub Pages"
git push

# Деплой произойдет автоматически через GitHub Actions
```

### Ручной деплой

```bash
# Установка gh-pages (один раз)
npm install --save-dev gh-pages

# Деплой (скрипт уже настроен в package.json)
npm run deploy
```

---

## 🧹 Очистка и переустановка

```bash
# Удалить node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановить зависимости
npm install

# Очистить кеш npm
npm cache clean --force

# Удалить dist
rm -rf dist
```

---

## 🔍 Проверка и отладка

```bash
# Проверить версию Node
node --version

# Проверить версию npm
npm --version

# Проверить установленные пакеты
npm list --depth=0

# Проверить устаревшие пакеты
npm outdated

# Обновить пакеты (осторожно!)
npm update

# Проверить package.json на ошибки
npm run build
```

---

## 📊 Размер bundle

```bash
# Сборка с анализом размера
npm run build

# Результаты в терминале после сборки
# dist/index.html
# dist/assets/index-[hash].js
# dist/assets/vendor-[hash].js
```

---

## 🌍 Проверка в production

```bash
# Сборка
npm run build

# Локальный preview
npm run preview

# Откройте в браузере:
# http://localhost:4173

# Проверьте:
# - Навигация работает
# - F5 не дает 404
# - Темная тема работает
# - Модальные окна открываются
```

---

## 🔐 Переменные окружения

```bash
# Создать .env файл (скопировать из примера)
cp .env.example .env

# Открыть для редактирования
nano .env
# или
vim .env
# или откройте в редакторе

# Добавить переменную
echo "VITE_API_KEY=your_key_here" >> .env

# НЕ коммитьте .env в Git! (уже в .gitignore)
```

---

## 📝 Полезные команды

```bash
# Найти процесс на порту 5173 (если порт занят)
lsof -i :5173

# Убить процесс
kill -9 PID

# Проверить свободное место
df -h

# Размер папки node_modules
du -sh node_modules

# Размер папки dist
du -sh dist

# Открыть проект в VSCode
code .

# Открыть package.json
cat package.json

# Открыть README
cat README.md
```

---

## 🆘 Команды при проблемах

```bash
# Проблема: npm install не работает
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Проблема: Порт 5173 занят
# Найдите и убейте процесс (см. выше)
# Или используйте другой порт:
npm run dev -- --port 5174

# Проблема: Build fails
rm -rf node_modules dist
npm install
npm run build

# Проблема: Git push fails
git pull --rebase origin main
git push

# Проблема: Permission denied
sudo npm install -g package-name
# Или настройте npm без sudo
```

---

## 📚 Справка по командам

```bash
# Помощь по npm
npm help

# Помощь по git
git help

# Помощь по Vercel CLI
vercel help

# Помощь по Netlify CLI
netlify help

# Список npm скриптов
npm run
```

---

## 🎯 Быстрая шпаргалка

```bash
# Локальная разработка
npm install && npm run dev

# Production preview
npm run build && npm run preview

# Git push
git add . && git commit -m "Update" && git push

# Vercel деплой
vercel --prod

# Netlify деплой
netlify deploy --prod

# Полная переустановка
rm -rf node_modules && npm install
```

---

## ✨ Копи-паста для быстрого деплоя

### Вариант 1: Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
npm install -g vercel
vercel login
vercel --prod
```

### Вариант 2: Netlify

```bash
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Вариант 3: GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
# Настройте Pages в Settings → Pages → GitHub Actions
```

---

**Сохраните этот файл для быстрого доступа к командам!** 📌
