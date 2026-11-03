import {
    IDEAL_TONES_DARK,
    IDEAL_TONES_LIGHT,
    formatHex,
    generateScale,
    getContrastRatio,
    oklchToRgbSafe,
    parseHex,
    rgbToOklch,
    type ChromaTheme,
    type ThemeMode,
} from 'chroma42';

/**
 * Адаптер Chroma42 → слой токенов платформы.
 *
 * Задача модуля — сделать переход с M3-HCT на Chroma42 БЕСШОВНЫМ:
 * имена токенов (`--md-sys-color-*`) и `@theme`-маппинг в globals.css
 * остаются как есть, меняется только ИСТОЧНИК значений. Тогда ни один
 * компонент менять не нужно — меняется цвет.
 *
 * Источник значения — один из трёх:
 *   • `semantic` — готовый семантический токен Chroma42;
 *   • `tone`     — примитив на фиксированном тоне (уровни surface-container,
 *                  которых у Chroma42 три, а у M3 — пять);
 *   • `const`    — фиксированное значение (scrim).
 *
 * @see src/lib/theme.ts — слой M3 (текущий движок платформы)
 */

export type MdTokenMap = Record<string, string>;

type Source =
    | { kind: 'semantic'; name: string }
    | { kind: 'tone'; primitive: 'neutral'; role: string }
    | { kind: 'const'; value: string };

/** Маппинг: имя нашего токена → источник в Chroma42. */
const TOKEN_SOURCES: Record<string, Source> = {
    primary: { kind: 'semantic', name: 'primary' },
    'on-primary': { kind: 'semantic', name: 'on-primary' },
    'primary-container': { kind: 'semantic', name: 'primary-container' },
    'on-primary-container': { kind: 'semantic', name: 'on-primary-container' },
    secondary: { kind: 'semantic', name: 'secondary' },
    'on-secondary': { kind: 'semantic', name: 'on-secondary' },
    'secondary-container': { kind: 'semantic', name: 'secondary-container' },
    'on-secondary-container': { kind: 'semantic', name: 'on-secondary-container' },
    tertiary: { kind: 'semantic', name: 'tertiary' },
    'on-tertiary': { kind: 'semantic', name: 'on-tertiary' },
    'tertiary-container': { kind: 'semantic', name: 'tertiary-container' },
    'on-tertiary-container': { kind: 'semantic', name: 'on-tertiary-container' },
    error: { kind: 'semantic', name: 'error' },
    'on-error': { kind: 'semantic', name: 'on-error' },
    'error-container': { kind: 'semantic', name: 'error-container' },
    'on-error-container': { kind: 'semantic', name: 'on-error-container' },
    surface: { kind: 'semantic', name: 'surface' },
    'on-surface': { kind: 'semantic', name: 'on-surface' },
    'on-surface-variant': { kind: 'semantic', name: 'on-surface-variant' },
    // surface-variant в M3 = тот же нейтральный тон, что и surface-container.
    'surface-variant': { kind: 'tone', primitive: 'neutral', role: 'surface-container' },
    outline: { kind: 'semantic', name: 'outline' },
    // outline-variant в M3 = «сильная» граница → у Chroma42 это border-strong.
    'outline-variant': { kind: 'semantic', name: 'border-strong' },
    'surface-container': { kind: 'semantic', name: 'surface-container' },
    'surface-container-high': { kind: 'semantic', name: 'surface-container-high' },
    'surface-container-lowest': { kind: 'tone', primitive: 'neutral', role: 'surface-container-lowest' },
    'surface-container-low': { kind: 'tone', primitive: 'neutral', role: 'surface-container-low' },
    'surface-container-highest': { kind: 'tone', primitive: 'neutral', role: 'surface-container-highest' },
    background: { kind: 'tone', primitive: 'neutral', role: 'background' },
    'on-background': { kind: 'semantic', name: 'on-surface' },
    scrim: { kind: 'const', value: '#000000' },
    // surface-tint в M3 = primary; парный on-surface-tint = on-primary.
    'surface-tint': { kind: 'semantic', name: 'primary' },
    'on-surface-tint': { kind: 'semantic', name: 'on-primary' },
};

/** Роли Chroma42 для светлого/тёмного режима. */
const TONES = {
    'light-normal': IDEAL_TONES_LIGHT,
    'dark-normal': IDEAL_TONES_DARK,
} as const;

/**
 * Порог «почти нейтрального» сида для ч/б режима.
 * В OKLCH это эквивалент примерно HCT chroma < 8 (как в M3-версии).
 */
const BW_CHROMA_LIMIT = 0.025;

/** Сид близок к нейтральному → тема должна быть чёрно-белой. */
export function isBwSeed(seed: string): boolean {
    const parsed = parseHex(seed);
    if (!parsed) return false;
    return rgbToOklch(parsed).c < BW_CHROMA_LIMIT;
}

/**
 * Читаемый вариант брендового цвета — для ТЕКСТА (ссылки, подписи).
 *
 * Первичный цвет — это «настоящий» выбранный seed, и он же заливка кнопки.
 * Но как текст на светлой поверхности яркий seed нечитаем (контраст ~2:1).
 * Поэтому для текста берётся тот же оттенок и та же насыщенность, но
 * затемнённые до 4.5:1 на поверхности — цвет остаётся «тем же», а читается.
 *
 * В тёмной теме primary и так светлый (тон 70 якорной шкалы) — берём его же.
 */
export function buildPrimaryText(
    theme: ChromaTheme,
    mode: 'light-normal' | 'dark-normal',
    flat: Record<string, string>,
): string | undefined {
    const primary = flat['primary'];
    if (!primary) return undefined;

    if (mode === 'dark-normal') return primary;

    const surface = flat['surface'];
    if (!surface) return primary;

    // Если выбранный цвет и так читается как текст — не трогаем его:
    // кнопка остаётся ровно того цвета, который выбрали.
    if (getContrastRatio(primary, surface) >= 4.5) return primary;

    const scale = theme.primitives.primary;
    // Тоны ниже 50 — темнее сида. Ищем самый светлый из проходящих по
    // контрасту: так текст остаётся максимально близким к выбранному.
    const candidates = Object.keys(scale)
        .map(Number)
        .filter((tone) => tone < 50)
        .sort((a, b) => b - a);

    for (const tone of candidates) {
        const color = scale[tone];
        if (!color) continue;
        if (getContrastRatio(color, surface) >= 4.5) return color;
    }
    return scale[0] ?? '#000000';
}

/**
 * Тон нейтрального ряда с фолбэком.
 *
 * В шкале Chroma42 доступны тона 0,5,10,…,95,99,100 — произвольных
 * номеров (например, 4, как в M3) там нет. Фолбэк гарантирует, что
 * токен НИКОГДА не пропадёт из темы (пропуск токена = неверный цвет
 * компонента, хуже, чем чуть другой оттенок).
 */
function tone(
    scale: Record<number, string>,
    t: number,
    fallback: number,
): string {
    return scale[t] ?? scale[fallback];
}

/**
 * Ч/б-тема: нейтральный ряд без цвета (аналог bwOverrides в M3-версии).
 * Первичная пара и поверхности доводятся до настоящих чёрно-белых.
 */
function bwTokens(
    theme: ChromaTheme,
    mode: 'light-normal' | 'dark-normal',
): MdTokenMap {
    const n = theme.primitives.neutral;
    const dark = mode === 'dark-normal';
    const out: MdTokenMap = {
        '--md-sys-color-primary': tone(n, dark ? 90 : 10, dark ? 90 : 10),
        '--md-sys-color-on-primary': tone(n, dark ? 10 : 100, dark ? 10 : 100),
        '--md-sys-color-primary-container': tone(n, dark ? 30 : 90, dark ? 30 : 90),
        '--md-sys-color-on-primary-container': tone(
            n,
            dark ? 90 : 10,
            dark ? 90 : 10,
        ),
        '--md-sys-color-background': tone(n, dark ? 0 : 100, dark ? 0 : 100),
        '--md-sys-color-on-background': tone(n, dark ? 90 : 10, dark ? 90 : 10),
        '--md-sys-color-surface': tone(n, dark ? 0 : 100, dark ? 0 : 100),
        '--md-sys-color-on-surface': tone(n, dark ? 90 : 10, dark ? 90 : 10),
        // surface-tint = primary → парный on-surface-tint обязателен,
        // иначе текст на тинте нечитаем (та же логика, что в M3).
        '--md-sys-color-surface-tint': tone(n, dark ? 90 : 10, dark ? 90 : 10),
        '--md-sys-color-on-surface-tint': tone(
            n,
            dark ? 10 : 100,
            dark ? 10 : 100,
        ),
    };
    return out;
}

/**
 * Собирает наши `--md-sys-color-*` из развёрнутой темы Chroma42.
 * Ключи результата — готовые CSS-переменные платформы.
 */
export function buildMdTokens(
    theme: ChromaTheme,
    mode: 'light-normal' | 'dark-normal',
    flat: Record<string, string>,
    bw = false,
): MdTokenMap {
    const tones = TONES[mode];
    const out: MdTokenMap = {};

    for (const [name, source] of Object.entries(TOKEN_SOURCES)) {
        let value: string | undefined;
        if (source.kind === 'semantic') {
            value = flat[source.name];
        } else if (source.kind === 'tone') {
            const tone = tones[source.role];
            value =
                tone === undefined
                    ? undefined
                    : theme.primitives[source.primitive][tone];
        } else {
            value = source.value;
        }
        if (value) out[`--md-sys-color-${name}`] = value;
    }

    // Ч/б режим: нейтральные поверхности и настоящая чёрно-белая пара.
    if (bw) Object.assign(out, bwTokens(theme, mode));

    return out;
}

/**
 * Декоративные ext-акценты (боке-элементы): та же идея, что в M3, но
 * оттенок поворачивается в OKLCH, а ряд строится движком Chroma42.
 * Смещения и тона повторяют M3-версию (90/270/300/120, тон 40|80).
 */
const EXT_ACCENTS: { name: string; hueOffset: number }[] = [
    { name: 'lime-accent', hueOffset: 90 },
    { name: 'lavender-light', hueOffset: 270 },
    { name: 'lavender-purple', hueOffset: 300 },
    { name: 'green-accent', hueOffset: 120 },
];

/** Строит `--md-ext-*` из сида: тон 40 (светлая) / 80 (тёмная). */
export function buildExtTokens(
    seed: string,
    dark: boolean,
    bw = false,
): MdTokenMap {
    const parsed = parseHex(seed);
    const out: MdTokenMap = {};
    if (!parsed) return out;

    const oklch = rgbToOklch(parsed);
    const mainTone = dark ? 80 : 40;
    const onTone = dark ? 20 : 100;

    for (const accent of EXT_ACCENTS) {
        if (bw) {
            // Ч/б режим: нейтральные акценты, как в M3-версии.
            const neutral = generateScale('#808080');
            out[`--md-ext-${accent.name}`] = neutral[mainTone];
            out[`--md-ext-on-${accent.name}`] = neutral[onTone];
            continue;
        }
        const rotated = oklchToRgbSafe({
            l: oklch.l,
            c: oklch.c,
            h: (oklch.h + accent.hueOffset) % 360,
        });
        const scale = generateScale(formatHex({ ...rotated, alpha: 1 }));
        out[`--md-ext-${accent.name}`] = scale[mainTone];
        out[`--md-ext-on-${accent.name}`] = scale[onTone];
    }

    return out;
}

/** Режимы Chroma42, которые использует платформа. */
export const PLATFORM_MODES: ThemeMode[] = ['light-normal', 'dark-normal'];
