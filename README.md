# ux42 portfolio ✦

Минималистичный и молниеносный сервис портфолио для дизайнеров. Построен на современном Edge-стеке с фокусом на продуктивность, приватность и нулевую стоимость инфраструктуры.

---

### ✨ Особенности

- **Публичный каталог:** Лаконичные страницы профилей (`/u/designer`) и проектов с мгновенным откликом на Edge.
- **Закрытый доступ:** Регистрация строго по инвайтам для сохранения качества комьюнити.
- **Изолированная суперадминка:** Безопасность маршрутов `/super-admin` на сетевом уровне через Cloudflare Zero Trust (без костылей с сессиями).
- **Zero Egress Fee:** Все медиафайлы и галереи хранятся в R2 с неограниченным бесплатным исходящим трафиком.

---

### 🛠 Технологический стек

- **Фреймворк:** Next.js (App Router, Server Actions) + OpenNext
- **База данных:** Cloudflare D1 (Serverless SQLite)
- **ORM:** Drizzle ORM
- **Хранилище медиа:** Cloudflare R2
- **Безопасность:** Cloudflare Zero Trust (Access)
- **Деплой:** Cloudflare Pages / Workers

---

### 🚀 Быстрый старт

1. **Клонирование и установка зависимостей**

```bash
git clone https://github.com/your-username/designfolio.git
cd designfolio
npm install

```

2. **Настройка окружения**
   Создайте файл `.env.local` и укажите переменные:

```env
SUPER_ADMIN_EMAILS=admin@example.com

```

3. **Локальный запуск с эмуляцией D1 и R2**

```bash
npm run dev

```

4. **Миграции базы данных**

```bash
npx drizzle-kit generate
npx wrangler d1 migrations apply <YOUR_DB_NAME> --local

```

---

### 📂 Структура проекта

```text
├── app/
│   ├── (public)/          # Главная, профили (/u/[user-slug]) и проекты
│   ├── admin/             # Админка дизайнера (CRUD проектов, профиль)
│   ├── super-admin/       # Суперадминка (пользователи, инвайты, модерация)
│   └── api/               # Server Actions & API роуты
├── db/                    # Drizzle схема, индексы и миграции
└── public/                # Статические ресурсы

```

---

### 📄 Лицензия

MIT
