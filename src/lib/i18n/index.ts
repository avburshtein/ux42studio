// D-012: двуязычная админка (ru/en). Лёгкая собственная i18n-система —
// без next-intl/react-i18next: админка не нуждается в URL-роутинге локалей,
// а словари типизированы структурой (en: Translations) и не разъезжаются.
import ru from './ru';
import en from './en';

export type Lang = 'ru' | 'en';
export type { Translations } from './ru';

/** Cookie с выбранным языком админки (ставит переключатель в AdminShell). */
export const LANG_COOKIE = 'admin_lang';
export const DEFAULT_LANG: Lang = 'ru';
export const LANGUAGES: Array<Lang> = ['ru', 'en'];

const dicts: Record<Lang, unknown> = { ru, en };

export function isLang(value: string | undefined | null): value is Lang {
    return value === 'ru' || value === 'en';
}

function lookup(dict: unknown, key: string): string | undefined {
    const value = key
        .split('.')
        .reduce<unknown>(
            (acc, k) => (acc as Record<string, unknown> | undefined)?.[k],
            dict,
        );
    return typeof value === 'string' ? value : undefined;
}

/**
 * t('wizard.nav.problem') → строка словаря. Плейсхолдеры {name}
 * интерполируются из params. Отсутствующий ключ: в dev видно ⟨key⟩,
 * в проде — фолбэк на второй язык, затем сам ключ.
 */
export function translate(
    lang: Lang,
    key: string,
    params?: Record<string, string | number>,
): string {
    let value = lookup(dicts[lang], key);
    if (value === undefined) {
        value = lookup(dicts[lang === 'ru' ? 'en' : 'ru'], key);
        if (value === undefined) {
            // Незнакомый ключ: в dev видно ⟨key⟩, в проде возвращаем сам
            // ключ (важно для t(zodMessage) — текст-не-ключ проходит насквозь).
            value =
                process.env.NODE_ENV === 'development' ? `⟨${key}⟩` : key;
        }
    }
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            value = value.replaceAll(`{${k}}`, String(v));
        }
    }
    return value;
}

/** Локаль для дат (updatedLabel в списке проектов и т.п.). */
export function dateLocale(lang: Lang): string {
    return lang === 'ru' ? 'ru-RU' : 'en-US';
}
