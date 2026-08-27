# 📝 Шпаргалка по деплою (5 минут)

## 🎯 Самый быстрый путь - Vercel

### 1️⃣ GitHub (если ещё не сделано)
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### 2️⃣ Vercel
1. Откройте: https://vercel.com
2. Sign Up через GitHub
3. New Project → Выберите репозиторий
4. Deploy (все настройки автоматические)

**⏱️ Время: 2 минуты | Результат: ваш-проект.vercel.app**

---

## 🎨 Альтернатива - Netlify Drop

### Еще проще!
```bash
npm run build
```
1. Откройте: https://app.netlify.com/drop
2. Перетащите папку `dist`
3. Готово!

**⏱️ Время: 1 минута**

---

## 🔧 Команды

```bash
# Разработка
npm install          # Установка зависимостей (первый раз)
npm run dev          # Запуск локально (localhost:5173)

# Деплой
npm run build        # Сборка production
npm run preview      # Проверка перед деплоем
```

---

## ✅ Быстрая проверка

После деплоя откройте в браузере:
- Главная: `your-url.com/`
- Портфолио: `your-url.com/portfolio`
- F5 на любой странице (должно работать)

---

## 🆘 Проблема?

**404 ошибки:** уже исправлено в `vercel.json` и `netlify.toml` ✅

**Build fails:** 
```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Подробные инструкции

- 🚀 [QUICKSTART.md](./QUICKSTART.md) - быстрый старт
- 📖 [DEPLOY.md](./DEPLOY.md) - полная инструкция
- ✅ [CHECKLIST.md](./CHECKLIST.md) - чеклист проверки

---

## 🎉 Все готово!

Проект уже настроен для деплоя:
✅ vercel.json
✅ netlify.toml  
✅ GitHub Actions
✅ SEO мета-теги
✅ Роутинг
✅ Оптимизация

**Просто задеплойте и получайте результат!**
