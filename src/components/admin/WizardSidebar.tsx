'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Eye } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const STEPS = [
    { key: 'general', label: 'General (Meta)', path: 'general' },
    { key: 'problem', label: 'Problem & Audience', path: 'problem' },
    { key: 'research', label: 'Research', path: 'research' },
    { key: 'design', label: 'Design', path: 'design' },
    { key: 'gallery', label: 'Gallery', path: 'gallery' },
    { key: 'showcase', label: 'Showcase', path: 'showcase' },
    { key: 'results', label: 'Results', path: 'results' },
    { key: 'review', label: 'Review & Publish', path: 'review' },
] as const;

export function WizardSidebar({
    projectId,
    projectTitle,
    profileSlug,
    projectSlug,
}: {
    projectId: string;
    projectTitle: string;
    profileSlug?: string;
    projectSlug?: string;
}) {
    const pathname = usePathname();
    // Моб. dropdown-«фильтр» шагов (референс 2026-10-26: хедер + фильтр
    // разделов). Закрывается при переходе.
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const stepHref = (path: string) =>
        `/admin/projects/${projectId}/edit/${path}`;
    const activeStep = STEPS.find((s) => pathname === stepHref(s.path));

    return (
        <>
            {/* === Мобила (<lg): dropdown-селектор шагов вместо сайдбара ===
                Свёрнут — кнопка с названием текущего шага; раскрыт — список
                с галочкой у активного (как в референсе). Тач-таргеты ≥44px.
                sticky top-18 — «заморожен» под хедером (72px + border).
                Бэнд во всю ширину как хедер (-mx компенсирует паддинг
                контента): гап сверху/снизу ВНУТРИ бэнда — при скролле остаётся
                на месте, а контент проезжает под полупрозрачным фоном
                (surface/90 + blur, «совсем чут-чуть» — фидбэк 2026-10-26). */}
            <div className='sticky top-18 z-30 -mx-4 bg-surface/90 px-4 py-4 backdrop-blur-md md:-mx-8 md:px-8 lg:hidden'>
                <button
                    type='button'
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-label='Выбрать раздел кейса'
                    className='flex w-full items-center justify-between gap-2 rounded-md border border-outline-variant bg-surface px-4 py-3 text-title-md text-on-surface'
                >
                    <span className='truncate'>
                        {activeStep?.label ?? projectTitle}
                    </span>
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>
                {open && (
                    <ul className='mt-1 overflow-hidden rounded-md border border-outline-variant bg-surface'>
                        {STEPS.map((step) => {
                            const isActive = pathname === stepHref(step.path);
                            return (
                                <li
                                    key={step.key}
                                    className='border-b border-outline-variant last:border-b-0'
                                >
                                    <Link
                                        href={stepHref(step.path)}
                                        className={`flex items-center justify-between gap-2 px-4 py-3 text-body-lg ${
                                            isActive
                                                ? 'font-medium text-on-surface'
                                                : 'text-on-surface-variant'
                                        }`}
                                    >
                                        {step.label}
                                        {isActive && (
                                            <Check className='h-5 w-5 shrink-0 text-primary' />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                        {profileSlug && projectSlug && (
                            <li className='border-t border-outline-variant'>
                                <Link
                                    href={`/u/${profileSlug}/${projectSlug}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-2 px-4 py-3 text-body-lg text-primary'
                                >
                                    <Eye className='h-5 w-5' />
                                    Просмотр проекта
                                </Link>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* === Десктоп (≥lg): сайдбар как был === */}
            <aside className='hidden w-64 shrink-0 lg:block'>
            <nav className='sticky top-8'>
                <div className=''>
                    <h2 className='mb-4 text-title-lg text-on-background'>
                        {projectTitle}
                    </h2>
                </div>
                <ul className='space-y-1'>
                    {STEPS.map((step) => {
                        const href = `/admin/projects/${projectId}/edit/${step.path}`;
                        const isActive = pathname === href;
                        return (
                            <li key={step.key}>
                                <Link
                                    href={href}
                                    className={`block rounded-md px-3 py-2 text-body-sm transition-colors ${
                                        isActive
                                            ? 'bg-primary-container text-on-primary-container font-medium'
                                            : 'text-on-surface-variant hover:bg-surface-variant/50'
                                    }`}
                                >
                                    {step.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                {profileSlug && projectSlug && (
                    <div className='mt-8 border-t border-outline-variant pt-4'>
                        <Link
                            href={`/u/${profileSlug}/${projectSlug}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            // C2: hover:text-primary-variant ссылался на
                            // несуществующий токен. В M3 роли Primary Variant
                            // нет (это имя из Material 2), и Figma-агент
                            // подтвердил: токена нет и в макете. Элемент уже
                            // text-primary, поэтому цвет в hover не
                            // переключаем — используем state layer (opacity),
                            // как и в остальных ссылках проекта.
                            className='flex items-center gap-1 text-body-sm text-primary transition-opacity duration-150 ease-out hover:opacity-80'
                        >
                            <Eye />{' '}
                            <span className='font-medium'>
                                Просмотр проекта
                            </span>
                        </Link>
                    </div>
                )}
            </nav>
        </aside>
        </>
    );
}
