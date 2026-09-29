'use client';

import { Eye } from 'lucide-react';
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

    return (
        <aside className='w-64 shrink-0'>
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
    );
}
