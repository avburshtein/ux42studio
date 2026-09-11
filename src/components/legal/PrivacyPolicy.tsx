import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import {
    EN_PRIVACY_SECTIONS,
    ES_PRIVACY_SECTIONS,
    PRIVACY_ES_LABEL,
    PRIVACY_LAST_UPDATED,
    type PrivacySection,
    type PrivacyTable,
} from '@/lib/privacyContent';

// Ссылка в тексте (по макету: зелёная, подчёркнутая)
const LINK_CLASS =
    'text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80';

// Автолинки email/URL. Применяются к intro/bullets/contact; в lines (§1)
// по макету ссылки не подсвечиваются — они не проходят через этот рендер.
const AUTOLINK_RE =
    /((?:https?:\/\/|www\.)[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

// Фрагмент текста с автолинками email/URL
function Autolink({ chunk, chunkKey }: { chunk: string; chunkKey: string }) {
    const parts = chunk.split(AUTOLINK_RE);
    return (
        <>
            {parts.map((part, i) => {
                if (!part) {
                    return null;
                }
                if (i % 2 === 0) {
                    return <Fragment key={`${chunkKey}-${i}`}>{part}</Fragment>;
                }
                const href = part.startsWith('www.')
                    ? `https://${part}`
                    : part.includes('@')
                      ? `mailto:${part}`
                      : part;
                const isMailto = href.startsWith('mailto:');
                return (
                    <a
                        key={`${chunkKey}-${i}`}
                        href={href}
                        {...(isMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                        className={LINK_CLASS}
                    >
                        {part}
                    </a>
                );
            })}
        </>
    );
}

// Мини-разметка контента: сегменты **жирный** + автолинки в обычном тексте
function RichText({ text }: { text: string }) {
    const segments = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <>
            {segments.map((segment, i) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                    return (
                        <strong key={i} className='font-medium text-on-surface'>
                            {segment.slice(2, -2)}
                        </strong>
                    );
                }
                return <Autolink key={i} chunk={segment} chunkKey={String(i)} />;
            })}
        </>
    );
}

// Таблица: шапка title-sm на bg-surface-container, ячейки body-sm, первая
// колонка полужирная (макет); на мобильных горизонтальный скролл.
function LegalTable({ table }: { table: PrivacyTable }) {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full min-w-[560px] border-collapse text-left align-top'>
                <thead>
                    <tr>
                        {table.headers.map((header, i) => (
                            <th
                                key={i}
                                scope='col'
                                className='border-b border-outline-variant bg-surface-container px-4 py-3 text-title-sm text-on-surface md:px-5'
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => (
                                <td
                                    key={c}
                                    className={cn(
                                        'border-b border-outline-variant px-4 py-3 text-body-sm md:px-5',
                                        c === 0
                                            ? 'font-medium text-on-surface'
                                            : 'text-on-surface-variant',
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Секция: заголовок headline-sm (font-display) + контент
// (intro → lines → таблица → bullets → контактный блок ведомства)
function LegalSection({ section }: { section: PrivacySection }) {
    return (
        <section>
            <h2 className='font-display text-headline-sm font-medium text-on-surface'>
                {section.number}. {section.title}
            </h2>
            <div className='mt-5 space-y-4'>
                {section.intro?.map((paragraph, i) => (
                    <p key={i} className='text-body-md text-on-surface-variant'>
                        <RichText text={paragraph} />
                    </p>
                ))}
                {section.lines && (
                    <div className='space-y-2'>
                        {section.lines.map((line, i) => (
                            <p key={i} className='text-body-md text-on-surface-variant'>
                                {line}
                            </p>
                        ))}
                    </div>
                )}
                {section.table && <LegalTable table={section.table} />}
                {section.bullets && (
                    <ul className='list-disc space-y-2 pl-5'>
                        {section.bullets.map((item, i) => (
                            <li key={i} className='text-body-md text-on-surface-variant'>
                                <RichText text={item} />
                            </li>
                        ))}
                    </ul>
                )}
                {section.contact && (
                    <div className='space-y-1'>
                        <p className='text-body-md font-medium text-on-surface'>
                            {section.contact.title}
                        </p>
                        {section.contact.lines.map((line, i) => (
                            <p key={i} className='text-body-md text-on-surface-variant'>
                                <RichText text={line} />
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}


// Разделитель EN → ES: пунктирные линии + пилюля с точкой (по макету)
function EsDivider() {
    return (
        <div className='my-16 flex flex-col items-center gap-6'>
            <span
                aria-hidden='true'
                className='w-full border-t border-dashed border-outline-variant'
            />
            <span className='inline-flex items-center gap-2.5 rounded-full border border-outline-variant px-5 py-2 text-label-md uppercase tracking-[0.08em] text-on-surface-variant'>
                <span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-primary' />
                {PRIVACY_ES_LABEL}
            </span>
            <span
                aria-hidden='true'
                className='w-full border-t border-dashed border-outline-variant'
            />
        </div>
    );
}

// Статья Privacy Policy: H1 + Last updated → 12 секций EN → разделитель →
// 12 секций ES. Колонка статьи — max-w-5xl (1024px) по центру
// section-container: уже контента футера, как в макете.
export function PrivacyPolicy() {
    return (
        <div className='section-container pb-16 pt-16 md:pb-24 md:pt-24'>
            <div className='mx-auto w-full max-w-5xl'>
                <h1 className='font-display text-headline-lg font-medium text-on-surface'>
                    Privacy Policy
                </h1>
                <p className='mt-3 text-body-sm text-on-surface-variant'>
                    Last updated: {PRIVACY_LAST_UPDATED}
                </p>

                <div className='mt-14 space-y-16 md:mt-16'>
                    {EN_PRIVACY_SECTIONS.map((section) => (
                        <LegalSection key={section.number} section={section} />
                    ))}
                </div>

                <EsDivider />

                <div className='space-y-16'>
                    {ES_PRIVACY_SECTIONS.map((section) => (
                        <LegalSection key={section.number} section={section} />
                    ))}
                </div>
            </div>
        </div>
    );
}

