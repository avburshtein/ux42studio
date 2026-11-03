import { getContrastRatio } from 'chroma42';

/**
 * Проверки читаемости темы — на языке пользователя, а не в цифрах аудита.
 *
 * Дизайнер не может «починить» пару токенов, поэтому показывать ему
 * «184 пары, 0 провалов» бесполезно. Полезно одно: понятный список
 * «кнопки видны, текст читаем, ссылки различимы» — с галочками.
 *
 * Пороги — WCAG 2.2: 4.5:1 для текста, 3:1 для границ элементов.
 */

export type ThemeCheckId =
    | 'buttonVisible'
    | 'buttonText'
    | 'bodyText'
    | 'mutedText'
    | 'links'
    | 'chips'
    | 'cards';

export type ThemeCheck = {
    id: ThemeCheckId;
    /** Проходит ли пара порог. */
    ok: boolean;
    /** Фактический контраст. */
    ratio: number;
    /** Требуемый порог. */
    required: number;
};

/**
 * Пары «текст на фоне», которые действительно есть в интерфейсе.
 *
 * `bg: PAGE` — пара проверяется на ФОНЕ СТРАНИЦЫ, а не на токене surface:
 * если дизайнер задал свой цвет фона, текст лежит на нём (фидбэк
 * 2026-11-03: «хрома не выдала ошибку», хотя фон был близок к primary).
 */
const PAIRS: {
    id: ThemeCheckId;
    fg: string;
    bg: string;
    required: number;
}[] = [
    // Кнопка видна на фоне страницы. Заливая кнопки, мы рисуем ей
    // границу цветом primary-text: у тёмного сида она совпадает с
    // заливкой (невидима), у яркого — даёт видимый контур.
    { id: 'buttonVisible', fg: 'primary-text', bg: 'PAGE', required: 3 },
    // Текст на кнопке.
    { id: 'buttonText', fg: 'on-primary', bg: 'primary', required: 4.5 },
    // Основной и второстепенный текст на поверхности.
    { id: 'bodyText', fg: 'on-surface', bg: 'PAGE', required: 4.5 },
    { id: 'mutedText', fg: 'on-surface-variant', bg: 'PAGE', required: 4.5 },
    // Ссылки и подписи брендовым цветом.
    { id: 'links', fg: 'primary-text', bg: 'PAGE', required: 4.5 },
    // Значки и метки (primary-container).
    { id: 'chips', fg: 'on-primary-container', bg: 'primary-container', required: 4.5 },
    // Текст на приподнятых карточках.
    { id: 'cards', fg: 'on-surface', bg: 'surface-container-high', required: 4.5 },
];

/**
 * Считает проверки по набору токенов режима.
 * Токены передаются без префикса `--md-sys-color-`.
 *
 * @param pageBackground фон страницы, если дизайнер задал свой. Если не
 *   задан — берётся токен surface.
 */
export function buildThemeChecks(
    tokens: Record<string, string | undefined>,
    pageBackground?: string,
): ThemeCheck[] {
    return PAIRS.map(({ id, fg, bg, required }) => {
        const fgColor = tokens[fg];
        const bgColor =
            bg === 'PAGE' ? (pageBackground ?? tokens.surface) : tokens[bg];
        if (!fgColor || !bgColor) {
            return { id, ok: true, ratio: 0, required };
        }
        const ratio = getContrastRatio(fgColor, bgColor);
        return { id, ok: ratio >= required - 1e-9, ratio, required };
    });
}

/** Все ли проверки пройдены. */
export function checksPassed(checks: ThemeCheck[]): boolean {
    return checks.every((check) => check.ok);
}
