'use client';

import { useEffect, useState } from 'react';
import { LANG_COOKIE, type Lang } from '@/lib/i18n';

/**
 * Переключатель языка интерфейса (ru/en) для публичных зон, где нет
 * AdminLangProvider: экран входа/регистрации и AuthBar над хедером.
 * Работает с тем же cookie admin_lang, что и AdminLangSwitch в админке:
 * язык, выбранный на экране входа, подхватывается админкой после логина
 * (и наоборот). Визуал — как AdminLangSwitch: текст без рамок,
 * активный язык — primary (фидбэк 2026-11-02).
 */
export function LangSwitch() {
    const [lang, setLangState] = useState<Lang>('ru');

    // Cookie читается после маунта (SSR-дефолт 'ru', как у ThemeToggle).
    useEffect(() => {
        const match = document.cookie
            .split('; ')
            .find((c) => c.startsWith(`${LANG_COOKIE}=`));
        if (match?.split('=')[1] === 'en') setLangState('en');
    }, []);

    const setLang = (next: Lang) => {
        setLangState(next);
        // Тот же формат cookie, что пишет AdminLangSwitch: 1 год, path=/
        document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000`;
    };

    return (
        <div
            role='group'
            aria-label='Language'
            className='flex items-center gap-2 text-label-sm'
        >
            {(['ru', 'en'] as const).map((code) => {
                const active = lang === code;
                return (
                    <button
                        key={code}
                        type='button'
                        onClick={() => setLang(code)}
                        aria-pressed={active}
                        className={`rounded px-0.5 py-1.5 uppercase transition-colors ${
                            active
                                ? 'text-primary'
                                : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                        {code}
                    </button>
                );
            })}
        </div>
    );
}
