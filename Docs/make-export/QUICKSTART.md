# 🚀 Быстрый старт для деплоя

## Самый простой способ - Vercel (5 минут)

### Шаг 1: Подготовка
```bash
# Убедитесь, что код загружен на GitHub
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/ваш-username/ваш-репо.git
git push -u origin main
```

### Шаг 2: Деплой
1. Откройте https://vercel.com
2. Нажмите "Sign Up" (войдите через GitHub)
3. Нажмите "Add New..." → "Project"
4. Выберите ваш репозиторий
5. Нажмите "Deploy"

### Шаг 3: Готово! 🎉
Ваш сайт онлайн через 2 минуты!

---

## Альтернатива - Netlify (тоже 5 минут)

### Drag & Drop метод (ещё проще!)
```bash
# 1. Соберите проект
npm run build

# 2. Откройте https://app.netlify.com/drop
# 3. Перетащите папку dist
# 4. Готово!
```

---

## Что уже настроено в проекте ✅

- ✅ `vercel.json` - конфигурация для Vercel
- ✅ `netlify.toml` - конфигурация для Netlify
- ✅ `.github/workflows/deploy.yml` - автодеплой на GitHub Pages
- ✅ `package.json` - все необходимые скрипты
- ✅ `index.html` - SEO мета-теги
- ✅ `robots.txt` и `sitemap.xml` - для поисковых систем
- ✅ `.gitignore` - правильные исключения
- ✅ `README.md` - полная документация

---

## Команды для локального тестирования

```bash
# Разработка
npm run dev          # Запуск dev сервера на http://localhost:5173

# Продакшен сборка
npm run build        # Создание production сборки в папке dist
npm run preview      # Предпросмотр production сборки локально
```

---

## После деплоя - настройте домен

### В Vercel:
1. Project Settings → Domains
2. Add Domain → введите ваш домен
3. Следуйте инструкциям для настройки DNS

### В Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Настройте DNS у вашего регистратора

---

## Проблемы?

### Ошибка при сборке
```bash
# Очистите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 при переходе на страницы
- Для Vercel и Netlify: уже настроено в конфигах ✅
- Для GitHub Pages: убедитесь, что используете правильный `base` в `vite.config.ts`

### Изображения не загружаются
- Проверьте, что все изображения в папке `public/`
- Используйте относительные пути

---

## Следующие шаги

1. ✅ Деплой сайта
2. 🔗 Настройка собственного домена
3. 📊 Добавление аналитики (Google Analytics)
4. 🔍 Обновление SEO мета-тегов в `index.html`
5. 🎨 Замена placeholder контента на реальный

---

## Полезные ссылки

- 📚 [Детальная инструкция](./DEPLOY.md)
- 📖 [Документация проекта](./README.md)
- 🌐 [Vercel Docs](https://vercel.com/docs)
- 🌐 [Netlify Docs](https://docs.netlify.com)

---

**Нужна помощь?** Откройте [DEPLOY.md](./DEPLOY.md) для детальных инструкций!
