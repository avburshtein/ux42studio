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
    uniform: {
        name: 'Равномерная сетка',
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
