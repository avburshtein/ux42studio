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
  const light = {
    ...schemeToTokens(new SchemeTonalSpot(Hct.fromInt(seedArgb), false, 0)),
    ...extToTokens(seedArgb, false),
  };
  const dark = {
    ...schemeToTokens(new SchemeTonalSpot(Hct.fromInt(seedArgb), true, 0)),
    ...extToTokens(seedArgb, true),
  };

  const block = (selector: string, tokens: ThemeTokens) =>
    selector + ' {\n' + Object.entries(tokens).map(([k, v]) => '  ' + k + ': ' + v + ';').join('\n') + '\n}';

  return block(":root", light) + "\\n" + block("[data-theme=dark]", dark);
}

/** Валидация hex (3/6), для инпута. */
export function isValidSeed(value: string): boolean {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value.trim());
}

/** Фирменные пресеты сидов (дефолт задаётся globals.css, не пресетом). */
export const PRESET_SEEDS: { label: string; value: string }[] = [
  { label: 'Terminator Green', value: '#0b6e4f' },
  { label: 'Lavender', value: '#5a5891' },
  { label: 'Acid', value: '#ccff00' },
  { label: 'Sunset', value: '#b12a33' },
  { label: 'Ocean', value: '#005a9e' },
];
