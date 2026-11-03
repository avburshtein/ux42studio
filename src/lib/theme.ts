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
