import { generateChromaThemeCss, type ChromaAudit } from './chroma42';
import type { ThemeEngine } from './mainPageContent';
import { generateThemeCss } from './theme';

/**
 * Диспетчер движков цветовой темы.
 *
 * Оба движка отдают ОДИН И ТОТ ЖЕ набор CSS-переменных `--md-sys-color-*`,
 * поэтому переключение движка не требует правок компонентов — меняются
 * только значения цветов.
 *
 *   • `m3`      — Material 3 HCT (движок платформы по умолчанию);
 *   • `chroma42` — Chroma42: seed даёт «настоящий» выбранный цвет,
 *                  плюс приходит аудит доступности.
 *
 * @see src/lib/theme.ts — M3-движок
 * @see src/lib/chroma42/index.ts — адаптер Chroma42
 */
export function buildThemeCss(
    seed: string | undefined,
    engine: ThemeEngine = 'm3',
): string {
    if (typeof seed !== 'string' || !seed.trim()) return '';
    return engine === 'chroma42'
        ? generateChromaThemeCss(seed).css
        : generateThemeCss(seed);
}

/**
 * Сводка аудита доступности для текущей темы.
 * Только у Chroma42 — у M3-движка аудита нет, возвращаем null.
 */
export function buildThemeAudit(
    seed: string | undefined,
    engine: ThemeEngine = 'm3',
): ChromaAudit | null {
    if (typeof seed !== 'string' || !seed.trim()) return null;
    if (engine !== 'chroma42') return null;
    return generateChromaThemeCss(seed).audit;
}
