'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const STEPS = [
    { key: 'general', label: 'General (Meta)', path: 'general' },
    { key: 'problem', label: 'Problem & Audience', path: 'problem' },
    { key: 'research', label: 'Research', path: 'research' },
    { key: 'design', label: 'Design', path: 'design' },
    { key: 'showcase', label: 'Showcase', path: 'showcase' },
    { key: 'review', label: 'Review & Publish', path: 'review' },
] as const;

export function WizardSidebar({
    projectId,
    projectTitle,
}: {
    projectId: string;
    projectTitle: string;
}) {
    const pathname = usePathname();

    return (
        <aside className='w-64 shrink-0'>
            <nav className='sticky top-8'>
                <h2 className='mb-4 text-title-lg text-on-background'>
                    {projectTitle}
                </h2>
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
                <div className='mt-6 border-t border-outline-variant pt-4'>
                    <Link
                        href='/admin'
                        className='text-body-sm text-on-surface-variant hover:text-on-surface'
                    >
                        ← Назад к проектам
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
