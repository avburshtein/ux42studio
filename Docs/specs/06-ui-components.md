# Spec: Этап 6 — UI-компоненты (shadcn + бизнес-компоненты)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 1 (layout, темизация), Этапы 2-4 (страницы используют компоненты)
> Ожидаемый результат: полный набор UI-атомов и бизнес-компонентов, все используют токены MD3

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Tailwind CSS v4 + shadcn (radix UI) + `lucide-react`
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`
- **Шрифты:** Poppins (заголовки), Inter (основной текст)
- **Правила:**
    - ❌ инлайн-стили (`style={{ ... }}`)
    - ❌ хардкод HEX-цветов
    - ✅ Все цвета через CSS-переменные: `var(--md-sys-color-primary)` и т.д.
    - ✅ Tailwind-классы с токенами: `bg-[var(--md-sys-color-surface)]`
    - ✅ ARIA-метки, keyboard navigation, семантика H1-H3 (WCAG 2.2 / EAA 2025)

### Существующие компоненты

| Файл                                   | Назначение                    |
| -------------------------------------- | ----------------------------- |
| `src/components/ui/Button.tsx`         | Кнопка                        |
| `src/components/ui/Card.tsx`           | Карточка                      |
| `src/components/ui/Input.tsx`          | Поле ввода                    |
| `src/components/ui/Label.tsx`          | Лейбл                         |
| `src/components/auth/LoginForm.tsx`    | Форма входа                   |
| `src/components/auth/RegisterForm.tsx` | Форма регистрации             |
| `src/components/ThemeProvider.tsx`     | Провайдер темы (из Этапа 1)   |
| `src/components/ProjectCard.tsx`       | Карточка проекта (из Этапа 2) |

---

## 6.1 Базовые UI-атомы (shadcn)

Все компоненты копируются из shadcn и адаптируются под токены MD3.

### Файлы для создания:

| Компонент      | Файл                                 | На основе                       |
| -------------- | ------------------------------------ | ------------------------------- |
| `Select`       | `src/components/ui/Select.tsx`       | `@radix-ui/react-select`        |
| `Textarea`     | `src/components/ui/Textarea.tsx`     | нативный `<textarea>`           |
| `Checkbox`     | `src/components/ui/Checkbox.tsx`     | `@radix-ui/react-checkbox`      |
| `Switch`       | `src/components/ui/Switch.tsx`       | `@radix-ui/react-switch`        |
| `Dialog`       | `src/components/ui/Dialog.tsx`       | `@radix-ui/react-dialog`        |
| `DropdownMenu` | `src/components/ui/DropdownMenu.tsx` | `@radix-ui/react-dropdown-menu` |
| `Tabs`         | `src/components/ui/Tabs.tsx`         | `@radix-ui/react-tabs`          |
| `Badge`        | `src/components/ui/Badge.tsx`        | нативный `<span>`               |
| `Avatar`       | `src/components/ui/Avatar.tsx`       | `@radix-ui/react-avatar`        |
| `Skeleton`     | `src/components/ui/Skeleton.tsx`     | нативный `<div>`                |
| `Toast`        | `src/components/ui/Toast.tsx`        | `@radix-ui/react-toast`         |

**Правила адаптации под MD3:**

- Все цвета: `var(--md-sys-color-*)` вместо хардкода
- Primary = `var(--md-sys-color-primary)` для активных состояний
- Surface = `var(--md-sys-color-surface)` для фона
- On Surface = `var(--md-sys-color-on-surface)` для текста
- Outline = `var(--md-sys-color-outline)` для бордеров
- Error = `var(--md-sys-color-error)` для ошибок
- Шрифты: `font-heading` (Poppins) для заголовков, `font-sans` (Inter) для текста

---

## 6.2 Бизнес-компоненты

### 6.2.1 `ProjectCard`

**Файл:** `src/components/ProjectCard.tsx` (создан в Этапе 2)

Уже реализован. Проверить:

- Использует ли токены MD3
- Есть ли `aria-label` на ссылке
- Есть ли скелетон-стейт для загрузки

### 6.2.2 `ProjectForm`

**Файл:** `src/components/ProjectForm.tsx` (создать)

Общая обёртка для всех шагов wizard'а.

**Пропсы:**

```ts
type ProjectFormProps = {
    title: string; // Заголовок секции
    description?: string; // Описание секции
    children: React.ReactNode; // Поля формы
    onSave: () => Promise<void>; // Автосохранение
    isSaving?: boolean;
};
```

**Рендеринг:**

- Заголовок H2
- Описание (серый текст)
- `children`
- Кнопка «Save» / спиннер при сохранении

### 6.2.3 `SectionEditor`

**Файл:** `src/components/SectionEditor.tsx` (создать)

Редактор одной секции с автосохранением.

**Пропсы:**

```ts
type SectionEditorProps = {
    projectId: string;
    sectionName: string;
    children: React.ReactNode;
    onSave: (data: unknown) => Promise<void>;
};
```

**Логика:**

- Обёртка с React Hook Form
- Автосохранение при блюре полей (debounce 2 сек)
- Индикатор «Saved» / «Saving...» / «Error»

### 6.2.4 `ImageUploader`

**Файл:** `src/components/ImageUploader.tsx` (создать)

Drag-n-drop зона для загрузки изображений.

**Пропсы:**

```ts
type ImageUploaderProps = {
    value: { fileId: string; r2Key: string } | null;
    onChange: (file: { fileId: string; r2Key: string } | null) => void;
    accept?: string; // default: 'image/*'
    maxSize?: number; // default: 10 * 1024 * 1024
    aspectRatio?: number; // для кропа
};
```

**Рендеринг:**

- Зона drag-n-drop с пунктирной рамкой
- Превью загруженного изображения
- Прогресс-бар при загрузке
- Кнопка удаления
- Сообщения об ошибках (размер, формат)

**Логика:**

- При выборе файла → `POST /api/upload` (FormData)
- Отслеживание прогресса через `XMLHttpRequest`
- При успехе → `onChange({ fileId, r2Key })`

### 6.2.5 `ColorRolePicker`

**Файл:** `src/components/ColorRolePicker.tsx` (создать)

Выбор цветовых ролей из таблицы `colorRoles`.

**Пропсы:**

```ts
type ColorRolePickerProps = {
    value: Array<{ roleId: string; order: number }>;
    onChange: (roles: Array<{ roleId: string; order: number }>) => void;
};
```

**Рендеринг:**

- Загрузка списка `colorRoles` из БД (через пропсы или fetch)
- Сетка ролей с превью цветов (light/dark пары)
- Выбор/снятие роли
- Drag-n-drop для сортировки

### 6.2.6 `AssetGallery`

**Файл:** `src/components/AssetGallery.tsx` (создать)

Сортируемая галерея ассетов проекта.

**Пропсы:**

```ts
type AssetGalleryProps = {
    assets: Array<{
        id: string;
        file: { r2Key: string; mimeType: string };
        assetType: 'moodboard' | 'wireframe' | 'final_gallery';
        caption: string | null;
        order: number;
    }>;
    onReorder: (orderedIds: string[]) => void;
    onDelete: (assetId: string) => void;
    onEditCaption: (assetId: string, caption: string) => void;
    readonly?: boolean;
};
```

**Рендеринг:**

- Фильтр по assetType (табы: All / Moodboard / Wireframe / Final)
- Сетка изображений
- Drag-n-drop для сортировки (если не readonly)
- Кнопка удаления
- Редактирование caption (inline)

### 6.2.7 `ProfileHeader`

**Файл:** `src/components/ProfileHeader.tsx` (создать)

Шапка профиля для публичной страницы.

**Пропсы:**

```ts
type ProfileHeaderProps = {
    profile: {
        fullName: string;
        headline: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        avatarFile: { r2Key: string } | null;
        coverFile: { r2Key: string } | null;
        socialLinks: Array<{
            platform: string;
            title: string;
            url: string;
        }>;
    };
};
```

**Рендеринг:**

- Обложка (фон) с градиентом если нет изображения
- Аватар (круглый, с бордером)
- FullName (H1)
- Headline
- Bio
- Location + Website (иконки)
- Соцсети (иконки-ссылки: GitHub, Behance, Dribbble, Telegram, custom)

### 6.2.8 `SocialLinksEditor`

**Файл:** `src/components/SocialLinksEditor.tsx` (создать)

Редактор соцсетей для страницы профиля в админке.

**Пропсы:**

```ts
type SocialLinksEditorProps = {
  value: Array<{
    id?: string;
    platform: string;
    title: string;
    url: string;
    order: number;
  }>;
  onChange: (links: Array<{...}>) => void;
};
```

**Рендеринг:**

- Список соцсетей
- Каждая: select platform + input title + input url + кнопка удаления
- Кнопка «Add Link»
- Drag-n-drop для сортировки

### 6.2.9 `InviteGenerator`

**Файл:** `src/components/InviteGenerator.tsx` (создать)

Форма создания инвайта для суперадминки.

**Пропсы:**

```ts
type InviteGeneratorProps = {
    onCreated: (invite: { code: string }) => void;
};
```

**Рендеринг:**

- Input email (опционально)
- Input expiresAt (date picker, опционально)
- Кнопка «Generate Invite»
- Показ сгенерированного кода (копирование в буфер)

### 6.2.10 `DataTable`

**Файл:** `src/components/DataTable.tsx` (создать)

Таблица с сортировкой, поиском, пагинацией.

**Пропсы:**

```ts
type DataTableProps<T> = {
    data: T[];
    columns: Array<{
        key: string;
        header: string;
        sortable?: boolean;
        render?: (item: T) => React.ReactNode;
    }>;
    searchable?: boolean;
    searchPlaceholder?: string;
    pageSize?: number;
};
```

**Рендеринг:**

- Поисковая строка (если searchable)
- Таблица с заголовками (сортировка по клику)
- Пагинация (если данных больше pageSize)
- Empty state («Нет данных»)

---

## Проверка после выполнения

- [ ] Все базовые UI-атомы созданы и используют токены MD3
- [ ] `ImageUploader` загружает файлы в R2
- [ ] `AssetGallery` поддерживает drag-n-drop сортировку
- [ ] `ColorRolePicker` показывает превью цветов
- [ ] `DataTable` работает с сортировкой и пагинацией
- [ ] Все компоненты доступны (ARIA, keyboard)
- [ ] `tsc --noEmit` проходит без ошибок
- [ ] Нет инлайн-стилей и хардкода HEX

---

## Файлы этапа (checklist)

| Действие | Файл                                   |
| -------- | -------------------------------------- |
| Создать  | `src/components/ui/Select.tsx`         |
| Создать  | `src/components/ui/Textarea.tsx`       |
| Создать  | `src/components/ui/Checkbox.tsx`       |
| Создать  | `src/components/ui/Switch.tsx`         |
| Создать  | `src/components/ui/Dialog.tsx`         |
| Создать  | `src/components/ui/DropdownMenu.tsx`   |
| Создать  | `src/components/ui/Tabs.tsx`           |
| Создать  | `src/components/ui/Badge.tsx`          |
| Создать  | `src/components/ui/Avatar.tsx`         |
| Создать  | `src/components/ui/Skeleton.tsx`       |
| Создать  | `src/components/ui/Toast.tsx`          |
| Создать  | `src/components/ProjectForm.tsx`       |
| Создать  | `src/components/SectionEditor.tsx`     |
| Создать  | `src/components/ImageUploader.tsx`     |
| Создать  | `src/components/ColorRolePicker.tsx`   |
| Создать  | `src/components/AssetGallery.tsx`      |
| Создать  | `src/components/ProfileHeader.tsx`     |
| Создать  | `src/components/SocialLinksEditor.tsx` |
| Создать  | `src/components/InviteGenerator.tsx`   |
| Создать  | `src/components/DataTable.tsx`         |
