import type { Metadata } from 'next';
import {
    EN_TERMS_SECTIONS,
    ES_TERMS_SECTIONS,
    TERMS_ES_LABEL,
    TERMS_LAST_UPDATED,
} from '@/lib/termsContent';
import { LegalArticle } from '@/components/legal/LegalArticle';
import { LegalPageShell } from '@/components/legal/LegalPageShell';

// Legal-страница /terms — «Legal Notice & Terms of Use» EN+ES (решение (38),
// Docs/ui/Main_page_Spec.md); закрывает 404 по ссылкам футера и меню главной.
// Патчи из чата: T1 — реальная дата; T2 — переименование + блок LSSI Art. 10
// (контакт hello@ux42.studio — видимый контакт сайта; алиас в Email Routing
// добавляет Денис); T3 — §8 без «dynamically». Статическая (prerender).
export const metadata: Metadata = {
    title: 'Legal Notice & Terms of Use — UX42 Studio',
    description:
        'Legal notice (LSSI Art. 10) and Terms of Use of UX42.studio: website purpose, user obligations, intellectual property, liability limitations and applicable law (Spain).',
};

export default function TermsPage() {
    return (
        <LegalPageShell breadcrumbLabel='Terms of Use'>
            <LegalArticle
                title='Legal Notice & Terms of Use'
                lastUpdated={TERMS_LAST_UPDATED}
                sections={EN_TERMS_SECTIONS}
                esSections={ES_TERMS_SECTIONS}
                esLabel={TERMS_ES_LABEL}
            />
        </LegalPageShell>
    );
}
