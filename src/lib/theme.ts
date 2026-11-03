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
const SURFACE_TOKENS: { token: string; light: number; dark: number }[] = [
    { token: '--md-sys-color-surface-container-lowest', light: 18, dark: 8 },
    { token: '--md-sys-color-surface-container-low', light: 30, dark: 12 },
    { token: '--md-sys-color-surface-container', light: 40, dark: 16 },
    { token: '--md-sys-color-surface-container-high', light: 50, dark: 20 },
    { token: '--md-sys-color-surface-container-highest', light: 60, dark: 24 },
];

/**
 * Токены, которые при кастомном фоне считаются от него самого.
 *
 * - `surface-container-*` — карточки, метки и панели: иначе на насыщенном
 *   фоне они выглядят белыми пятнами.
 * - `background` — подвал: в светлой теме он был белым на сером фоне.
 *   Теперь он чуть темнее фона, как в дефолтной теме (там подвал темнее
 *   страницы).
 * - `shadow-card-glow` — «белое свечение» карточки: на сером фоне белый
 *   отсвет читался как белый налёт (фидбэк 2026-11-03), поэтому отсвет
 *   берётся от фона.
 */
export function surfaceTokensFrom(
    lightBg: string,
    darkBg: string = lightBg,
): string[] {
    // Светлая тема: поверхность — фон, подмешанный с белым (18% → 60%:
    // чем выше уровень, тем насыщеннее). Тёмная: в фон добавляется белый
    // (8% → 24%), чтобы карточки и метки были видны, а не сливались.
    const decls = (bg: string, dark: boolean) =>
        SURFACE_TOKENS.map(({ token, light, dark: d }) =>
            dark
                ? `${token}: color-mix(in srgb, #ffffff ${d}%, ${bg});`
                : `${token}: color-mix(in srgb, ${bg} ${light}%, #ffffff);`,
        ).join('');

    const light = [
        ...decls(lightBg, false),
        // Подвал: чуть темнее фона (как в дефолтной теме).
        `--md-sys-color-background: color-mix(in srgb, ${lightBg} 88%, #000000);`,
        // Отсвет карточки — от фона, а не белый.
        `--shadow-card-glow: color-mix(in srgb, ${lightBg} 55%, #ffffff);`,
    ].join('');
    const dark = [
        ...decls(darkBg, true),
        `--md-sys-color-background: color-mix(in srgb, ${darkBg} 88%, #000000);`,
        `--shadow-card-glow: color-mix(in srgb, #000000 86%, ${darkBg});`,
    ].join('');

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
