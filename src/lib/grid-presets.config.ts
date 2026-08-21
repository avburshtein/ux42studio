export interface GridPreset {
    name: string;
    slots: number;
    layoutClasses: string[];
}

export const GRID_PRESETS: Record<string, GridPreset> = {
    'hero-left': {
        name: 'Акцент слева',
        slots: 5,
        layoutClasses: [
            'col-span-4 row-span-2',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    'hero-right': {
        name: 'Акцент справа',
        slots: 5,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-4 row-span-2',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    panoramic: {
        name: 'Панорама и миниатюры',
        slots: 4,
        layoutClasses: [
            'col-span-8 row-span-1',
            'col-span-2 row-span-1',
            'col-span-4 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    'big-center': {
        name: 'Крупный центр',
        slots: 5,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-4 row-span-2',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    mosaic: {
        name: 'Мозаика',
        slots: 7,
        layoutClasses: [
            'col-span-3 row-span-1',
            'col-span-3 row-span-1',
            'col-span-2 row-span-2',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    'vertical-accent': {
        name: 'Вертикальный акцент',
        slots: 4,
        layoutClasses: [
            'col-span-3 row-span-2',
            'col-span-5 row-span-1',
            'col-span-2 row-span-1',
            'col-span-3 row-span-1',
        ],
    },
    'three-column': {
        name: 'Три колонки',
        slots: 6,
        layoutClasses: [
            'col-span-3 row-span-1',
            'col-span-3 row-span-1',
            'col-span-2 row-span-1',
            'col-span-3 row-span-1',
            'col-span-3 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    'top-heavy': {
        name: 'Тяжёлый верх',
        slots: 5,
        layoutClasses: [
            'col-span-4 row-span-1',
            'col-span-4 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-4 row-span-1',
        ],
    },
    'bottom-heavy': {
        name: 'Тяжёлый низ',
        slots: 5,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-4 row-span-1',
            'col-span-4 row-span-1',
            'col-span-4 row-span-1',
        ],
    },
    checkerboard: {
        name: 'Шахматная',
        slots: 8,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
    diptych: {
        name: 'Диптих',
        slots: 2,
        layoutClasses: ['col-span-4 row-span-2', 'col-span-4 row-span-2'],
    },
    triptych: {
        name: 'Триптих',
        slots: 3,
        layoutClasses: [
            'col-span-3 row-span-2',
            'col-span-3 row-span-2',
            'col-span-2 row-span-2',
        ],
    },
    window: {
        name: 'Окно',
        slots: 5,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-4 row-span-2',
        ],
    },
    staircase: {
        name: 'Лесенка',
        slots: 6,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-3 row-span-1',
            'col-span-3 row-span-1',
            'col-span-4 row-span-1',
            'col-span-4 row-span-1',
            'col-span-5 row-span-1',
        ],
    },
    uniform: {
        name: 'Равномерная (6)',
        slots: 6,
        layoutClasses: [
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
            'col-span-2 row-span-1',
        ],
    },
} as const;
