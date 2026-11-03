import { generateChromaThemeCss, type ChromaAudit } from './chroma42';

/**
 * Тема сайта: seed-цвет → набор CSS-переменных `--md-sys-color-*`.
 *
 * Движок один — Chroma42: он держит выбранный пользователем цвет
 * (Material 3 «выбеливал» сид до светлоты 0.5 и терял насыщенность).
 * Набор имён токенов при этом прежний, поэтому компоненты и вёрстка
 * не меняются — меняются только значения цветов.
 *
 * @see src/lib/chroma42/index.ts — адаптер Chroma42
 * @see src/lib/theme-checks.ts — проверки читаемости
 */
export function buildThemeCss(seed: string | undefined): string {
    if (typeof seed !== 'string' || !seed.trim()) return '';
    return generateChromaThemeCss(seed).css;
}

/**
 * Сводка аудита доступности для текущей темы.
 */
export function buildThemeAudit(
    seed: string | undefined,
): ChromaAudit | null {
    if (typeof seed !== 'string' || !seed.trim()) return null;
    return generateChromaThemeCss(seed).audit;
}
