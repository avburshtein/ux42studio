# ❓ Часто задаваемые вопросы (FAQ)

## 🚀 Общие вопросы о деплое

### Q: Сколько времени занимает деплой?
**A:** 1-5 минут в зависимости от платформы:
- Netlify Drop: 1 минута
- Vercel: 2 минуты
- GitHub Pages: 5 минут

### Q: Какую платформу выбрать?
**A:** Рекомендуем Vercel для начинающих:
- Простая настройка
- Автоматический деплой при push
- Бесплатный SSL
- Встроенная аналитика
- Хорошая документация

### Q: Нужно ли платить за хостинг?
**A:** Нет! Все три основные платформы бесплатны:
- Vercel: бесплатно для личных проектов
- Netlify: бесплатно до 100GB трафика/месяц
- GitHub Pages: полностью бесплатно

### Q: Можно ли использовать свой домен?
**A:** Да! Все платформы поддерживают собственные домены:
- Vercel: Settings → Domains
- Netlify: Site settings → Domain management
- GitHub Pages: Settings → Pages → Custom domain

### Q: Будет ли HTTPS?
**A:** Да, все платформы автоматически выдают бесплатный SSL сертификат от Let's Encrypt.

---

## 🔧 Технические вопросы

### Q: Нужно ли устанавливать Node.js локально для деплоя?
**A:** Зависит от метода:
- Vercel/Netlify через веб-интерфейс: НЕТ
- Vercel/Netlify через CLI: ДА
- GitHub Pages автодеплой: НЕТ

### Q: Какая версия Node.js нужна?
**A:** Node.js 18+ рекомендуется. Проверьте версию:
```bash
node --version
```

### Q: Что делать если npm install падает с ошибкой?
**A:** Попробуйте:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Q: Build fails с ошибкой "out of memory"
**A:** Увеличьте лимит памяти Node.js:
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Q: Как проверить сборку локально перед деплоем?
**A:**
```bash
npm run build
npm run preview
# Откройте http://localhost:4173
```

---

## 🐛 Проблемы и решения

### Q: После деплоя страница показывает 404 при обновлении (F5)
**A:** Это уже исправлено в конфигурациях! Проверьте:
- Vercel: `vercel.json` присутствует ✅
- Netlify: `netlify.toml` и `public/_redirects` присутствуют ✅
- GitHub Pages: может потребоваться hash router

### Q: Темная тема не работает после деплоя
**A:** Убедитесь что:
1. `ThemeContext.tsx` импортирован в App.tsx
2. `DarkModeStyler.tsx` рендерится
3. CSS файлы подключены
4. localStorage доступен (проверьте приватный режим)

### Q: Изображения не загружаются
**A:** Проверьте:
1. Используете ли относительные пути
2. Изображения в папке `public/`
3. Правильный `base` в `vite.config.ts` (для GitHub Pages)

### Q: CSS стили не применяются
**A:** Проверьте:
1. Tailwind CSS импортирован в `main.tsx`
2. `postcss.config.mjs` присутствует
3. `@tailwindcss/vite` в plugins

### Q: Модальные окна не открываются
**A:** Проверьте:
1. `ModalContext` обернут вокруг App
2. `ModalContainer` рендерится
3. Нет ошибок в консоли браузера (F12)

---

## 📱 Вопросы о функционале

### Q: Как работает роутинг?
**A:** Используется React Router v7:
- `BrowserRouter` для history-based навигации
- Все роуты в `src/app/App.tsx`
- Lazy loading для оптимизации

### Q: Как работает темная тема?
**A:** Через Context API:
1. `ThemeContext` хранит состояние темы
2. Сохраняется в localStorage
3. CSS переменные в `theme.css`
4. `DarkModeStyler` применяет стили

### Q: Где хранятся данные форм?
**A:** Это полностью frontend приложение:
- Данные НЕ сохраняются на сервер
- Нет backend'а
- Можно добавить интеграцию с API

### Q: Можно ли добавить backend?
**A:** Да, несколько вариантов:
1. Supabase (рекомендуется)
2. Firebase
3. Собственный Node.js API
4. Vercel Serverless Functions
5. Netlify Functions

---

## 🎨 Вопросы о кастомизации

### Q: Как изменить основной цвет?
**A:** Отредактируйте `src/styles/theme.css`:
```css
--color-primary: #0b6e4f; /* ваш цвет */
```

### Q: Как добавить новую страницу?
**A:**
1. Создайте файл в `src/app/pages/MyPage.tsx`
2. Добавьте роут в `src/app/App.tsx`:
   ```tsx
   <Route path="/mypage" element={<MyPage />} />
   ```
3. Добавьте в навигацию
4. Обновите `sitemap.xml`

### Q: Как изменить шрифт?
**A:**
1. Импортируйте в `src/styles/fonts.css`
2. Обновите font-family в `theme.css`

### Q: Как убрать анимации?
**A:** Удалите или закомментируйте:
- `FloatingElements.tsx`
- `FloatingMesh.tsx`
- Motion компоненты

---

## 🔍 SEO и аналитика

### Q: Как добавить Google Analytics?
**A:** Добавьте в `index.html` перед `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Q: Как обновить мета-теги?
**A:** Отредактируйте `index.html`:
- `<title>` - название
- `<meta name="description">` - описание
- Open Graph теги для соцсетей

### Q: Как добавить favicon?
**A:**
1. Создайте favicon.ico (16x16, 32x32)
2. Положите в `public/favicon.ico`
3. Обновите `<link rel="icon">` в index.html

### Q: Нужно ли обновлять sitemap.xml?
**A:** Да, замените `https://yourdomain.com/` на ваш реальный URL.

---

## 💾 Git и GitHub

### Q: Как загрузить проект на GitHub?
**A:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### Q: Что делать если git push выдает ошибку?
**A:** Возможные причины:
1. Нет прав доступа: настройте SSH ключи
2. Ветка отличается: `git pull --rebase`
3. Большие файлы: проверьте `.gitignore`

### Q: Какие файлы не нужно коммитить?
**A:** Уже настроено в `.gitignore`:
- `node_modules/`
- `dist/`
- `.env`
- `.DS_Store`
- `*.log`

---

## 🔐 Безопасность

### Q: Можно ли хранить API ключи в коде?
**A:** НЕТ! Используйте переменные окружения:
```bash
# .env (не коммитить!)
VITE_API_KEY=your_key
```
```tsx
// В коде
const apiKey = import.meta.env.VITE_API_KEY
```

### Q: Безопасны ли переменные VITE_*?
**A:** ВНИМАНИЕ: Они попадают в клиентский bundle!
- Используйте только для публичных ключей
- НЕ используйте для секретных данных
- Для секретов нужен backend

### Q: Как защитить формы от спама?
**A:** Добавьте:
1. reCAPTCHA от Google
2. Honeypot поля
3. Rate limiting (через backend)

---

## 📊 Производительность

### Q: Как уменьшить размер bundle?
**A:** Уже оптимизировано:
- Lazy loading компонентов
- Code splitting в `vite.config.ts`
- Tree shaking автоматически

### Q: Какой размер bundle нормальный?
**A:** Для этого проекта:
- Main bundle: ~100-200 KB
- Vendor chunks: ~300-500 KB
- Total: ~500-700 KB (gzipped ~150-200 KB)

### Q: Как ускорить загрузку?
**A:**
1. Оптимизируйте изображения (используйте WebP)
2. Включите CDN (автоматически в Vercel/Netlify)
3. Добавьте кеширование
4. Используйте lazy loading для изображений

---

## 🌐 Домены и DNS

### Q: Где купить домен?
**A:** Популярные регистраторы:
- Namecheap
- Google Domains
- Cloudflare
- GoDaddy

### Q: Как подключить домен к Vercel?
**A:**
1. Vercel: Settings → Domains → Add
2. У регистратора: добавьте A запись на IP Vercel
3. Или CNAME на `cname.vercel-dns.com`

### Q: Сколько времени занимает подключение домена?
**A:** DNS пропагация: от 5 минут до 48 часов (обычно ~2 часа)

---

## 🔄 Обновления

### Q: Как обновить сайт после изменений?
**A:** Просто запуште изменения:
```bash
git add .
git commit -m "Update"
git push
```
Vercel/Netlify/GitHub Pages автоматически пересоберут!

### Q: Можно ли откатить деплой?
**A:** Да, в панели хостинга:
- Vercel: Deployments → Promote to Production
- Netlify: Deploys → выберите старую версию

### Q: Как часто можно деплоить?
**A:** Без ограничений! Деплойте хоть 100 раз в день.

---

## 💰 Стоимость

### Q: Сколько стоит хостинг для personal проекта?
**A:** Бесплатно! Все платформы имеют generous free tier.

### Q: Когда нужно платить?
**A:** Только если нужно:
- Больше трафика (100GB+/месяц)
- Больше build минут
- Коммерческий проект (зависит от платформы)
- Продвинутые функции

### Q: Сколько стоит собственный домен?
**A:** ~$10-15/год в зависимости от зоны (.com, .io, etc.)

---

## 🆘 Где получить помощь?

### Документация проекта
- [START_HERE.md](./START_HERE.md) - начать здесь
- [QUICKSTART.md](./QUICKSTART.md) - быстрый старт
- [DEPLOY.md](./DEPLOY.md) - детальная инструкция
- [CHECKLIST.md](./CHECKLIST.md) - чеклист

### Документация платформ
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages](https://docs.github.com/pages)

### Документация технологий
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Комьюнити
- Stack Overflow
- Reddit r/webdev
- Discord серверы React/Vite

---

## ❓ Не нашли ответ?

1. Проверьте [DEPLOY.md](./DEPLOY.md) → "Проблемы и решения"
2. Проверьте консоль браузера (F12) для ошибок
3. Проверьте логи билда в панели хостинга
4. Загуглите ошибку
5. Спросите на Stack Overflow

---

**Добавьте свой вопрос:** Если у вас есть вопрос, которого нет в FAQ, добавьте его сюда для других пользователей!
