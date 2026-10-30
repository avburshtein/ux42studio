// Серверный t() для server-компонент (D-012). Отдельный модуль —
// next/headers нельзя импортировать в клиентские файлы (index.ts
// импортируется клиентом AdminLang).
import { cookies } from 'next/headers';
import { LANG_COOKIE, translate, isLang, type Lang } from './index';

export async function getServerLang(): Promise<Lang> {
    const c = await cookies();
    const v = c.get(LANG_COOKIE)?.value;
    return isLang(v) ? v : 'ru';
}

export function serverT(lang: Lang) {
    return (
        key: string,
        params?: Record<string, string | number>,
    ) => translate(lang, key, params);
}
