// D-012: контекст языка админки. Провайдер монтируется в AdminShell,
// начальное значение — из cookie admin_lang (ставит переключатель).
// SSR рендерит дефолт ('ru'); после гидрации cookie применяется —
// англоязычный пользователь видит RU-навигацию первые ~100 мс (как
// ThemeToggle до mounted). Все t() — клиентские, смена языка мгновенная,
// без перезагрузки страницы.
'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { LANG_COOKIE, translate, type Lang } from '@/lib/i18n';

interface AdminLangContextValue {
    lang: Lang;
    t: (key: string, params?: Record<string, string | number>) => string;
    setLang: (lang: Lang) => void;
}

const AdminLangContext = createContext<AdminLangContextValue | null>(null);

/** Читает cookie admin_lang (на сервере cookie нет → 'ru'). */
function readCookieLang(): Lang {
    if (typeof document === 'undefined') return 'ru';
    const match = document.cookie
        .split('; ')
        .find((c) => c.startsWith(`${LANG_COOKIE}=`));
    const value = match?.split('=')[1];
    return value === 'en' ? 'en' : 'ru';
}

export function AdminLangProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lang, setLangState] = useState<Lang>('ru');

    useEffect(() => {
        setLangState(readCookieLang());
    }, []);

    const value = useMemo<AdminLangContextValue>(
        () => ({
            lang,
            t: (key, params) => translate(lang, key, params),
            setLang: (next) => {
                setLangState(next);
                // 1 год; path=/ — чтобы читать и в server actions при
                // желании; SameSite=Lax по умолчанию
                document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000`;
            },
        }),
        [lang],
    );

    return (
        <AdminLangContext.Provider value={value}>
            {children}
        </AdminLangContext.Provider>
    );
}

/** Хук доступа к языку и переводу внутри админ-компонентов. */
export function useAdminLang(): AdminLangContextValue {
    const ctx = useContext(AdminLangContext);
    if (!ctx) {
        // Фолбэк, чтобы компонент не падал вне провайдера (страховка)
        return {
            lang: 'ru',
            t: (key, params) => translate('ru', key, params),
            setLang: () => {},
        };
    }
    return ctx;
}

/** Переключатель RU/EN — пилюля в хедере админки. Показывает язык,
 *  на который переключит (активный не активен — aria-pressed). */
export function AdminLangSwitch() {
    const { lang, setLang } = useAdminLang();
    return (
        <div
            role='group'
            aria-label='Language'
            className='flex overflow-hidden rounded-full border border-outline-variant text-label-sm'
        >
            {(['ru', 'en'] as const).map((code) => (
                <button
                    key={code}
                    type='button'
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`px-2.5 py-1.5 uppercase transition-colors ${
                        lang === code
                            ? 'bg-primary text-on-primary'
                            : 'text-on-surface-variant hover:bg-surface-variant'
                    }`}
                >
                    {code}
                </button>
            ))}
        </div>
    );
}
