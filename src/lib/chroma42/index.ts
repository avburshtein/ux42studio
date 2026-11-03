import {
    buildThemeBundle,
    flattenModes,
    generateHarmonySeeds,
    type HarmonySchemeId,
    type PolicyId,
} from 'chroma42';
import {
    buildExtTokens,
    buildMdTokens,
    isBwSeed,
    type MdTokenMap,
} from './tokens';

/**
 * Chroma42 в платформе ux42.studio — публичный API.
 *
 * Тема строится из сида дизайнера и раскладывается в те же CSS-переменные
 * `--md-sys-color-*`, что и M3-движок (`src/lib/theme.ts`). Поэтому
 * переключение движка не требует правок компонентов: меняются значения.
 *
 * @see src/lib/chroma42/tokens.ts — маппинг имён
 * @see Docs/roadmap/chroma42-migration.md — план перехода
 */

export type ChromaOptions = {
    /** Схема гармонии вторичных/третичных цветов. */
    scheme?: HarmonySchemeId;
    /** Политика доступности (пороги контраста). */
    policy?: PolicyId;
};

/** Сводка аудита доступности (та же форма, что theme.audit.summary). */
export type ChromaAudit = {
    totalPairsChecked: number;
    passed: number;
    warnings: number;
    failed: number;
    exportAllowed: boolean;
};

export type ChromaThemeResult = {
    /** CSS-переопределения для :root / [data-theme=dark]. */
    css: string;
    /** Сводка аудита доступности. */
    audit: ChromaAudit;
    /** Тема близка к нейтральной → применён ч/б режим. */
    bw: boolean;
};

const EMPTY_AUDIT: ChromaAudit = {
    totalPairsChecked: 0,
    passed: 0,
    warnings: 0,
    failed: 0,
    exportAllowed: false,
};

/** Валидация hex (3/6) — как в M3-версии. */
function isValidHex(value: string): boolean {
    return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value.trim());
}

/** Токены режима в виде CSS-переменных платформы. */
function tokensFor(
    mode: 'light-normal' | 'dark-normal',
    flat: Record<string, string>,
    theme: Parameters<typeof buildMdTokens>[0],
    seed: string,
    bw: boolean,
): MdTokenMap {
    const dark = mode === 'dark-normal';
    return {
        ...buildMdTokens(theme, mode, flat, bw),
        ...buildExtTokens(seed, dark, bw),
    };
}

/**
 * Собирает тему Chroma42 из сида и возвращает CSS-переопределения.
 * Невалидный сид → пустая строка (как в M3-версии: тема не применяется).
 */
export function generateChromaThemeCss(
    seed?: string,
    options: ChromaOptions = {},
): ChromaThemeResult {
    const trimmed = (seed ?? '').trim();
    if (!isValidHex(trimmed)) {
        return { css: '', audit: EMPTY_AUDIT, bw: false };
    }

    const scheme = options.scheme ?? 'triad';
    const policy = options.policy ?? 'standard-aa';
    const seeds = generateHarmonySeeds(trimmed, scheme);
    const { theme } = buildThemeBundle('ux42.studio', seeds, policy);
    const flat = flattenModes(theme);
    const bw = isBwSeed(trimmed);

    const light = tokensFor(
        'light-normal',
        flat['light-normal'] ?? {},
        theme,
        trimmed,
        bw,
    );
    const dark = tokensFor(
        'dark-normal',
        flat['dark-normal'] ?? {},
        theme,
        trimmed,
        bw,
    );

    const block = (selector: string, tokens: MdTokenMap) =>
        selector +
        ' {\n' +
        Object.entries(tokens)
            .map(([k, v]) => `  ${k}: ${v};`)
            .join('\n') +
        '\n}';

    const css =
        block(':root', light) +
        '\n' +
        block('[data-theme=dark]', dark) +
        '\n' +
        '@media (prefers-color-scheme: dark) {\n' +
        block(':root:not([data-theme=light])', dark) +
        '\n}';

    return { css, audit: theme.audit.summary, bw };
}

export type { MdTokenMap };
export { buildMdTokens, buildExtTokens, isBwSeed };
