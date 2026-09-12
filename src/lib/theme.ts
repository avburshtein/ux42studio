// Color Theme — M3-генерация темы из seed-цвета (пункт 4 спеки Color Theme).
// Движок: @material/material-color-utilities (официальный M3 HCT).
// Экспорт: generateThemeCss(seed) → CSS-переопределения переменных
// --md-sys-color-* / --md-ext-* (light в :root, dark в [data-theme=dark]),
// совместимые с токенами src/app/globals.css. Пустой seed = дефолты globals.
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
  Hct,
  SchemeTonalSpot,
  SchemeMonochrome,
} from '@material/material-color-utilities';

export type ThemeTokens = Record<string, string>;

/** Маппинг Scheme → имена наших токенов. */
function schemeToTokens(s: SchemeTonalSpot): ThemeTokens {
  return {
    '--md-sys-color-primary': hexFromArgb(s.primary),
    '--md-sys-color-surface-tint': hexFromArgb(s.surfaceTint),
    '--md-sys-color-on-primary': hexFromArgb(s.onPrimary),
    '--md-sys-color-primary-container': hexFromArgb(s.primaryContainer),
    '--md-sys-color-on-primary-container': hexFromArgb(s.onPrimaryContainer),
    '--md-sys-color-secondary': hexFromArgb(s.secondary),
    '--md-sys-color-on-secondary': hexFromArgb(s.onSecondary),
    '--md-sys-color-secondary-container': hexFromArgb(s.secondaryContainer),
    '--md-sys-color-on-secondary-container': hexFromArgb(s.onSecondaryContainer),
    '--md-sys-color-tertiary': hexFromArgb(s.tertiary),
    '--md-sys-color-on-tertiary': hexFromArgb(s.onTertiary),
    '--md-sys-color-tertiary-container': hexFromArgb(s.tertiaryContainer),
    '--md-sys-color-on-tertiary-container': hexFromArgb(s.onTertiaryContainer),
    '--md-sys-color-error': hexFromArgb(s.error),
    '--md-sys-color-on-error': hexFromArgb(s.onError),
    '--md-sys-color-error-container': hexFromArgb(s.errorContainer),
    '--md-sys-color-on-error-container': hexFromArgb(s.onErrorContainer),
    '--md-sys-color-background': hexFromArgb(s.background),
    '--md-sys-color-on-background': hexFromArgb(s.onBackground),
    '--md-sys-color-surface': hexFromArgb(s.surface),
    '--md-sys-color-on-surface': hexFromArgb(s.onSurface),
    '--md-sys-color-surface-variant': hexFromArgb(s.surfaceVariant),
    '--md-sys-color-on-surface-variant': hexFromArgb(s.onSurfaceVariant),
    '--md-sys-color-outline': hexFromArgb(s.outline),
    '--md-sys-color-outline-variant': hexFromArgb(s.outlineVariant),
    '--md-sys-color-scrim': '#000000',
    '--md-sys-color-surface-container-lowest': hexFromArgb(s.surfaceContainerLowest),
    '--md-sys-color-surface-container-low': hexFromArgb(s.surfaceContainerLow),
    '--md-sys-color-surface-container': hexFromArgb(s.surfaceContainer),
    '--md-sys-color-surface-container-high': hexFromArgb(s.surfaceContainerHigh),
    '--md-sys-color-surface-container-highest': hexFromArgb(s.surfaceContainerHighest),
  };
}

/**
 * Ч/б режим (seed близок к нейтральному, chroma < 8): SchemeMonochrome
 * даёт серые поверхности, но primary tone 40 — тёмно-серый, а не чёрный.
 * Дожимаем primary-пару и поверхности до настоящего чёрно-белого.
 */
function bwOverrides(dark: boolean): ThemeTokens {
  const tone = (t: number) => hexFromArgb(TonalPalette.fromHueAndChroma(0, 0).tone(t));
  return dark
    ? {
        '--md-sys-color-primary': tone(90),
        '--md-sys-color-on-primary': tone(10),
        '--md-sys-color-primary-container': tone(30),
        '--md-sys-color-on-primary-container': tone(90),
        '--md-sys-color-background': tone(4),
        '--md-sys-color-on-background': tone(90),
        '--md-sys-color-surface': tone(4),
        '--md-sys-color-on-surface': tone(90),
        '--md-sys-color-surface-tint': tone(90),
      }
    : {
        '--md-sys-color-primary': tone(10),
        '--md-sys-color-on-primary': tone(100),
        '--md-sys-color-primary-container': tone(90),
        '--md-sys-color-on-primary-container': tone(10),
        '--md-sys-color-background': tone(100),
        '--md-sys-color-on-background': tone(10),
        '--md-sys-color-surface': tone(100),
        '--md-sys-color-on-surface': tone(10),
        '--md-sys-color-surface-tint': tone(10),
      };
}

/** Extended accents: hue-ротация от сид (как в extended-палитре дизайна). */
function extToTokens(seedArgb: number, dark: boolean): ThemeTokens {
  const hue = new SchemeTonalSpot(Hct.fromInt(seedArgb), false, 0)
    .primaryPalette.hue;
  const mainTone = dark ? 80 : 40;
  const onTone = dark ? 20 : 100;
  const accent = (hueOffset: number, chroma: number, name: string) => {
    const p = TonalPalette.fromHueAndChroma((hue + hueOffset) % 360, chroma);
    return {
      ['--md-ext-' + name]: hexFromArgb(p.tone(mainTone)),
      ['--md-ext-on-' + name]: hexFromArgb(p.tone(onTone)),
    };
  };
  return {
    ...accent(90, 48, 'lime-accent'),
    ...accent(270, 36, 'lavender-light'),
    ...accent(300, 32, 'lavender-purple'),
    ...accent(120, 40, 'green-accent'),
  };
}

/** CSS-строка переопределений. Пустой/невалидный seed = пустая строка. */
export function generateThemeCss(seed?: string): string {
  const trimmed = (seed ?? "").trim();
  if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(trimmed)) return "";

  const seedArgb = argbFromHex(trimmed);
  const seedHct = Hct.fromInt(seedArgb);
  // Нейтральный seed (чёрный/белый/серый) → настоящая ч/б тема:
  // SchemeMonochrome (хрома 0) + дожим primary/поверхностей до ч/б.
  const bw = seedHct.chroma < 8;
  const make = (dark: boolean): ThemeTokens => {
    const scheme = bw
      ? schemeToTokens(new SchemeMonochrome(seedHct, dark, 0))
      : schemeToTokens(new SchemeTonalSpot(seedHct, dark, 0));
    const ext = bw ? extToTokensNeutral(dark) : extToTokens(seedArgb, dark);
    return bw ? { ...scheme, ...ext, ...bwOverrides(dark) } : { ...scheme, ...ext };
  };

  const block = (selector: string, tokens: ThemeTokens) =>
    selector + ' {\n' + Object.entries(tokens).map(([k, v]) => '  ' + k + ': ' + v + ';').join('\n') + '\n}';

  return block(":root", make(false)) + "\\n" + block("[data-theme=dark]", make(true));
}

/** Ext-акценты ч/б темы: та же нейтральная палитра, без цвета. */
function extToTokensNeutral(dark: boolean): ThemeTokens {
  const mainTone = dark ? 80 : 40;
  const onTone = dark ? 20 : 100;
  const accent = (name: string) => {
    const p = TonalPalette.fromHueAndChroma(0, 0);
    return {
      ['--md-ext-' + name]: hexFromArgb(p.tone(mainTone)),
      ['--md-ext-on-' + name]: hexFromArgb(p.tone(onTone)),
    };
  };
  return {
    ...accent('lime-accent'),
    ...accent('lavender-light'),
    ...accent('lavender-purple'),
    ...accent('green-accent'),
  };
}

/** Валидация hex (3/6), для инпута. */
export function isValidSeed(value: string): boolean {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value.trim());
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
