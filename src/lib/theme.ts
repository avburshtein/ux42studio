// Помощники цветовой темы.
//
// Генерация темы из seed-цвета живёт в src/lib/chroma42 (движок Chroma42):
// он держит выбранный пользователем цвет, тогда как Material 3 «выбеливал»
// сид до светлоты 0.5 и терял насыщенность. Здесь остались только утилиты,
// которые нужны админке и страницам: валидация hex, контрастный текст,
// смешивание с чёрным и фирменные пресеты.
//
// Генерация M3 удалена (D-019): переключатель движков убран из кастомайзера,
// откат — в истории git.

/** Валидация hex (3/6), для инпута. */
export function isValidSeed(value: string): boolean {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value.trim());
}

/**
 * Смесь двух hex в sRGB: `ratio` — доля первого цвета (0..1).
 * Нужна, чтобы посчитать цвет фона «акцентный тон» в JS — так же, как
 * это делает CSS `color-mix` в page.tsx.
 */
export function mixHex(a: string, b: string, ratio: number): string {
    const parse = (hex: string): [number, number, number] | null => {
        const m = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(hex.trim());
        if (!m) return null;
        const h =
            m[1].length === 3
                ? m[1].split('').map((c) => c + c).join('')
                : m[1];
        const n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const ca = parse(a);
    const cb = parse(b);
    if (!ca || !cb) return a;
    const ch = (v: number) =>
        Math.max(0, Math.min(255, Math.round(v)));
    const out = ca.map((v, i) => ch(v * ratio + cb[i] * (1 - ratio)));
    return '#' + out.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Смесь hex → чёрный (t = доля чёрного, 0..1). Для dark-вариантов
 * solid-цветов (хедер/фон), чтобы они не слепили в тёмной теме.
 */
export function mixWithBlack(hex: string, t: number): string {
  const m = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(hex.trim());
  if (!m) return hex;
  const h = m[1].length === 3
    ? m[1].split('').map((c) => c + c).join('')
    : m[1];
  const n = parseInt(h, 16);
  const ch = (v: number) => Math.round((1 - t) * v);
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

/**
 * Поверхности, выведенные из цвета фона страницы.
 *
 * Если фон насыщенный, а карточки и теги остаются белыми (surface-* из
 * темы), они выглядят «белыми пятнами» на странице, тени теряют смысл
 * (фидбэк 2026-11-03). Поэтому при кастомном фоне вся семейство
 * surface-container-* считается от него самого: чуть светлее фона в
 * светлой теме и чуть светлее — в тёмной.
 *
 * Возвращает готовые CSS-блоки. Важно: блок тёмной темы должен иметь ту
 * же специфичность, что и в теме Chroma42 (`:root`, `[data-theme=dark]`,
 * `@media (prefers-color-scheme: dark)` + `:root:not([data-theme=light])`),
 * иначе медиа-фолбэк темы перебьёт его по специфичности.
 */
/**
 * Тёмный вариант кастомного фона.
 *
 * Затемнять выбранный цвет смесью с чёрным (mixWithBlack) нельзя: если
 * цвет светлый и серый, получается СЕРЫЙ фон, а не тёмная тема (фидбэк
 * 2026-11-03). Поэтому тёмный фон берётся из самой темы — её тёмная
 * поверхность (почти чёрная, но с оттенком сида) — и в неё добавляется
 * 25% выбранного цвета: так фон глубокий и при этом связан с выбором.
 */
export function darkPageBackground(
    themeDarkSurface: string | undefined,
    color: string,
): string {
    const base = themeDarkSurface ?? '#000000';
    return mixHex(base, color, 0.25);
}

/**
 * Уровни поверхностей и доля фона в смеси с темой.
 *
 * Поверхности не ЗАМЕНЯются фоном, а СМЕШИВАЮТСЯ с ним: так они сохраняют
 * характер темы (оттенок сида в нейтралях, а не серая безликость) и при
 * этом не выглядят белыми пятнами на насыщенном фоне.
 *
 * Раньше поверхности считались чисто от фона — и всё становилось серым
 * при сером фоне (фидбэк 2026-11-03).
 */
const SURFACE_LEVELS = [
    'surface-container-lowest',
    'surface-container-low',
    'surface-container',
    'surface-container-high',
    'surface-container-highest',
] as const;

/** Доля фона в смеси: чем выше уровень, тем сильнее цвет фона. */
const LIGHT_SHARE = [12, 22, 32, 42, 52];
const DARK_SHARE = [18, 32, 46, 60, 74];

/**
 * Токены, которые при кастомном фоне считаются от него самого — но через
 * палитру темы.
 *
 * - `surface-container-*` — карточки, метки и панели: смесь фона с
 *   поверхностями темы. В тёмной теме нижние уровни уходят вглубь (это
 *   «утопленные» слои и затемняющая вуаль поверх обложки в Hero),
 *   верхние — наверх.
 * - `page-bg` — что реально видно под контентом: вторичная кнопка и
 *   внутренняя заливка бейджей не должны выделяться чёрным или белым.
 * - `background` — подвал: чуть другого оттенка, чем страница.
 * - `shadow-card-glow` — отсвет карточки: на сером фоне белый отсвет
 *   читался как белый налёт (фидбэк 2026-11-03), поэтому он тоже идёт
 *   через тему.
 */
export function surfaceTokensFrom(
    lightBg: string,
    darkBg: string,
    theme: { light: Record<string, string>; dark: Record<string, string> },
): string[] {
    const mix = (bg: string, base: string | undefined, share: number) =>
        base ? mixHex(bg, base, share / 100) : bg;

    const build = (bg: string, tokens: Record<string, string>, shares: number[]) => {
        const surfaces = SURFACE_LEVELS.map((level, i) =>
            `--md-sys-color-${level}: ${mix(bg, tokens[level], shares[i])};`,
        ).join('');
        return [
            surfaces,
            `--md-sys-color-page-bg: ${bg};`,
            `--md-sys-color-background: ${mix(bg, tokens.background, 0.8)};`,
            `--shadow-card-glow: ${mix(bg, tokens['surface-container-lowest'], 0.55)};`,
        ].join('');
    };

    const light = build(lightBg, theme.light, LIGHT_SHARE);
    const dark = build(darkBg, theme.dark, DARK_SHARE);

    return [
        `:root{${light}}`,
        `[data-theme=dark]{${dark}}`,
        `@media (prefers-color-scheme: dark){:root:not([data-theme=light]){${dark}}}`,
    ];
}

/**
 * Контрастный текст на произвольном фоне (solid-хедер/фоны).
 * Относительная luminance sRGB → тёмный или светлый цвет текста.
 */
export function contrastOn(hex: string): string {
  const m = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(hex.trim());
  if (!m) return '#000000';
  const h = m[1].length === 3
    ? m[1].split('').map((c) => c + c).join('')
    : m[1];
  const n = parseInt(h, 16);
  const lum =
    0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum > 140 ? '#1b1b1f' : '#ffffff';
}

/** Фирменные пресеты сидов (дефолт задаётся globals.css, не пресетом). */
export const PRESET_SEEDS: { label: string; value: string }[] = [
  { label: 'Terminator Green', value: '#0b6e4f' },
  { label: 'Lavender', value: '#5a5891' },
  { label: 'Acid', value: '#ccff00' },
  { label: 'Sunset', value: '#b12a33' },
  { label: 'Ocean', value: '#005a9e' },
];
