import type { Metadata } from 'next';
import { SiteFooter } from '@/components/case/SiteFooter';
import { ThemeToggle } from '@/components/case/ThemeToggle';
import {
    EN_PRIVACY_SECTIONS,
    ES_PRIVACY_SECTIONS,
    PRIVACY_ES_LABEL,
    PRIVACY_LAST_UPDATED,
} from '@/lib/privacyContent';
import { LegalArticle } from '@/components/legal/LegalArticle';
import { LegalPageShell } from '@/components/legal/LegalPageShell';

// Legal-страница /privacy — Privacy Policy EN+ES (решение (36),
// Docs/ui/Main_page_Spec.md); закрывает 404 по ссылке из футера (решение (29)).
// Статическая: контент из src/lib/privacyContent.ts, БД не трогается —
// prerender. Оболочка (sticky-панель Back + breadcrumb + ThemeToggle и футер)
// — общая с /terms: legal/LegalPageShell (решение (38)).
export const metadata: Metadata = {
    title: 'Privacy Policy — UX42 Studio',
    description:
        'Privacy Policy of UX42.studio: data controller, legal bases, data retention, recipients and international transfers (GDPR, LOPDGDD, LSSI-CE).',
};

export default function PrivacyPage() {
    return (
        <LegalPageShell breadcrumbLabel='Privacy Policy'>
            <LegalArticle
                title='Privacy Policy'
                lastUpdated={PRIVACY_LAST_UPDATED}
                sections={EN_PRIVACY_SECTIONS}
                esSections={ES_PRIVACY_SECTIONS}
                esLabel={PRIVACY_ES_LABEL}
            />
        </LegalPageShell>
    );
}
