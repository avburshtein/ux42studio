# 🚀 Инструкция по деплою проекта

## Содержание
- [Подготовка проекта](#подготовка-проекта)
- [Vercel (Рекомендуется)](#vercel)
- [Netlify](#netlify)
- [GitHub Pages](#github-pages)
- [Другие хостинги](#другие-хостинги)
- [После деплоя](#после-деплоя)

---

## Подготовка проекта

### 1. Проверка перед деплоем

Убедитесь, что проект корректно работает локально:

```bash
# Установите зависимости
npm install

# Запустите в режиме разработки
npm run dev

# Откройте http://localhost:5173 и проверьте работу
```

### 2. Создание продакшен сборки

```bash
# Соберите проект
npm run build

# Папка dist будет содержать готовые файлы
# Проверьте локально собранную версию:
npm run preview
```

### 3. Инициализация Git (если еще не сделано)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 4. Создайте репозиторий на GitHub

1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Назовите репозиторий (например: `design-studio-website`)
4. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
5. Скопируйте URL репозитория

### 5. Загрузите код на GitHub

```bash
git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
git branch -M main
git push -u origin main
```

---

## Vercel

### Метод 1: Через веб-интерфейс (Проще всего) ✅

1. **Зайдите на [vercel.com](https://vercel.com)**
2. **Нажмите "Sign Up" и войдите через GitHub**
3. **Нажмите "Add New..." → "Project"**
4. **Импортируйте ваш GitHub репозиторий**
5. **Vercel автоматически определит настройки:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Нажмите "Deploy"**

⏱️ Через 1-2 минуты ваш сайт будет доступен!

### Метод 2: Через CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Залогиньтесь
vercel login

# Задеплойте проект
vercel

# Для продакшена
vercel --prod
```

### Настройка собственного домена в Vercel

1. В панели проекта → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи у вашего регистратора

---

## Netlify

### Метод 1: Drag & Drop (Самый быстрый) ✅

1. **Соберите проект локально:**
   ```bash
   npm run build
   ```

2. **Зайдите на [netlify.com](https://netlify.com)**
3. **Перетащите папку `dist` на экран**

✨ Готово! Сайт онлайн!

### Метод 2: Через GitHub (С автоматическим деплоем)

1. **Зайдите на [netlify.com](https://netlify.com)**
2. **Нажмите "Add new site" → "Import an existing project"**
3. **Выберите GitHub и найдите ваш репозиторий**
4. **Настройки:**
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Нажмите "Deploy"**

### Метод 3: Через CLI

```bash
# Установите Netlify CLI
npm i -g netlify-cli

# Залогиньтесь
netlify login

# Инициализируйте проект
netlify init

# Задеплойте
netlify deploy --prod
```

### Настройка собственного домена в Netlify

1. Site settings → Domain management
2. Add custom domain
3. Следуйте инструкциям для настройки DNS

---

## GitHub Pages

### Автоматический деплой через GitHub Actions ✅

1. **Настройте GitHub Pages:**
   - Зайдите в Settings → Pages
   - Source: GitHub Actions

2. **Код уже содержит workflow файл** (`.github/workflows/deploy.yml`)

3. **Просто запушьте код:**
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push
   ```

4. **Сайт будет доступен по адресу:**
   ```
   https://ваш-username.github.io/название-репозитория/
   ```

### Ручной деплой

```bash
# Установите gh-pages
npm install --save-dev gh-pages

# Задеплойте (скрипты уже настроены)
npm run deploy
```

### ⚠️ Важно для GitHub Pages:

Если ваш репозиторий не на корневом домене, обновите `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/название-вашего-репозитория/',
  // ... остальная конфигурация
})
```

---

## Другие хостинги

### Cloudflare Pages

1. Зайдите на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Подключите GitHub репозиторий
3. Build command: `npm run build`
4. Build output: `dist`

### Render

1. Зайдите на [render.com](https://render.com)
2. New → Static Site
3. Подключите репозиторий
4. Build command: `npm run build`
5. Publish directory: `dist`

### Firebase Hosting

```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Инициализируйте проект
firebase init hosting

# Выберите:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Соберите и задеплойте
npm run build
firebase deploy
```

---

## После деплоя

### ✅ Чек-лист проверки

- [ ] Главная страница загружается
- [ ] Навигация работает (попробуйте перейти на /portfolio, /privacy)
- [ ] Переключение темы работает
- [ ] Модальные окна открываются (Get started, Sign Up)
- [ ] Изображения загружаются
- [ ] Мобильная версия корректно отображается
- [ ] Анимации работают плавно

### 🐛 Проблемы и решения

**Проблема:** 404 при обновлении страницы

**Решение:** Убедитесь, что настроены redirects:
- Vercel: `vercel.json` уже настроен ✅
- Netlify: `netlify.toml` уже настроен ✅
- GitHub Pages: используйте hash router или настройте 404.html

**Проблема:** Изображения не загружаются

**Решение:** Проверьте пути к изображениям. В Vercel/Netlify пути должны быть относительными.

**Проблема:** Стили не применяются

**Решение:** Проверьте `vite.config.ts` - параметр `base` должен соответствовать вашему домену.

---

## 🔄 Автоматическое обновление

После первого деплоя через GitHub:

```bash
# Внесите изменения в код
git add .
git commit -m "Update feature X"
git push

# Vercel/Netlify/GitHub Pages автоматически задеплоят новую версию!
```

---

## 📊 Мониторинг

### Vercel Analytics
- Добавьте в Settings → Analytics

### Netlify Analytics
- Добавьте в Site settings → Analytics

### Google Analytics
Добавьте в `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎉 Готово!

Ваш сайт теперь доступен в интернете! 

**Полезные ссылки:**
- 📚 [Vercel Documentation](https://vercel.com/docs)
- 📚 [Netlify Documentation](https://docs.netlify.com)
- 📚 [GitHub Pages Guide](https://docs.github.com/pages)

**Нужна помощь?**
- Проверьте логи билда в панели хостинга
- Откройте DevTools (F12) для проверки ошибок
- Проверьте консоль браузера
