// Словарь интерфейса админки — русский (D-012: двуязычная админка).
// Структура: namespace → ключ → строка. {name} — плейсхолдеры интерполяции.
// en.ts типизирован этим объектом (Translations) — TS не даст разъехаться.
const ru = {
    common: {
        save: 'Сохранить',
        saving: 'Сохраняем…',
        saved: 'Сохранено ✓',
        cancel: 'Отмена',
        remove: 'Удалить',
        add: 'Добавить',
        back: '← Назад',
        loading: 'Загрузка…',
        saveFailed: 'Не удалось сохранить',
        required: 'Обязательное поле',
        reset: 'Сбросить',
    },
    nav: {
        superAdmin: 'Суперадминка',
        projects: 'Ред. проекты',
        profilePage: 'Редактировать страницу сайта',
        settings: 'Настройки профиля',
        mySite: 'Мой сайт',
        help: 'Справка',
        signOut: 'Выйти',
        openMenu: 'Открыть меню',
        closeMenu: 'Закрыть меню',
        adminMenu: 'Меню админки',
        langLabel: 'Язык интерфейса',
    },
    dashboard: {
        title: 'Мои проекты',
        subtitle: 'Управляйте своими кейсами',
        createProject: 'Создать проект',
        tabAll: 'Все',
        tabDrafts: 'Черновики',
        tabPublished: 'Опубликованные',
        tabArchived: 'Архив',
        loading: 'Загружаем проекты…',
        loadError:
            'Не удалось загрузить проекты. Попробуйте обновить страницу.',
        emptyFiltered: 'Проектов в этой категории нет',
    },
    projects: {
        statusPublished: 'Опубликован',
        statusDraft: 'Черновик',
        statusArchived: 'Архив',
        delete: 'Удалить',
        unpublish: 'Снять с публикации',
        archive: 'В архив',
        publish: 'Опубликовать',
        unarchive: 'Восстановить',
        viewSite: 'На сайт',
        sortLabel: 'Сортировка',
        sortNewest: 'Сначала новые',
        sortOldest: 'Сначала старые',
        sortAlphaAsc: 'A → Z',
        sortAlphaDesc: 'Z → A',
        sortManual: 'Вручную (drag & drop)',
        manualHint:
            'Перетаскивайте строки за значок ⠿ — порядок сразу применится на сайте.',
    },
    wizard: {
        nav: {
            general: 'Общее (метаданные)',
            problem: 'Проблема и аудитория',
            research: 'Исследование',
            design: 'Дизайн',
            gallery: 'Галерея',
            showcase: 'Витрина',
            results: 'Результаты',
            review: 'Проверка и публикация',
        },
        selectSection: 'Выбрать раздел кейса',
        viewProject: 'Просмотр проекта',
        saveNext: 'Сохранить и далее →',
    },
};

export type Translations = typeof ru;
export default ru;
