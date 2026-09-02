#!/bin/bash

# ====================================
# КОМАНДЫ ДЛЯ ДЕПЛОЯ ПРОЕКТА
# ====================================

echo "🚀 Подготовка проекта к деплою..."

# ====================================
# 1. ЛОКАЛЬНАЯ ПРОВЕРКА
# ====================================

echo "\n📦 Установка зависимостей..."
npm install

echo "\n🔨 Сборка проекта..."
npm run build

echo "\n👀 Предпросмотр сборки..."
echo "Откройте http://localhost:4173 в браузере"
npm run preview

# ====================================
# 2. GIT ПОДГОТОВКА
# ====================================

echo "\n📝 Инициализация Git (если не сделано)..."
# git init
# git add .
# git commit -m "Ready for deployment"

# Создайте репозиторий на GitHub, затем:
# git remote add origin https://github.com/username/repository.git
# git branch -M main
# git push -u origin main

# ====================================
# 3. ВАРИАНТЫ ДЕПЛОЯ
# ====================================

# --- VERCEL ---
# Установка:
# npm i -g vercel

# Деплой:
# vercel login
# vercel
# vercel --prod

# --- NETLIFY ---
# Установка:
# npm i -g netlify-cli

# Деплой:
# netlify login
# netlify init
# netlify deploy --prod

# --- GITHUB PAGES ---
# Установка (если нужно):
# npm install --save-dev gh-pages

# Деплой:
# npm run deploy

echo "\n✅ Проект готов к деплою!"
echo "\n📚 Инструкции:"
echo "- Быстрый старт: cat QUICKSTART.md"
echo "- Полная инструкция: cat DEPLOY.md"
echo "- Шпаргалка: cat CHEATSHEET.md"
