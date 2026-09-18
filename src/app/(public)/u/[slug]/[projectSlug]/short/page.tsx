import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CaseShortView } from '@/components/case/CaseShortView';
import { SiteHeaderBreadcrumb } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import { PrintTldrButton } from '@/components/case/PrintTldrButton';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string; projectSlug: string }>;
}

function getImageUrl(r2Key: string): string {
    return `/r2/${r2Key}`;
}

// SEO — отдельный title с пометкой «Summary» для поисковиков и шаринга
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug, projectSlug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { slug },
        columns: { id: true, fullName: true },
    });
    if (!profile) return { title: 'UX42 Studio' };

    const project = await db.query.projects.findFirst({
        where: { profileId: profile.id, slug: projectSlug, status: 'published' },
        columns: { title: true, teaser: true },
    });
    if (!project) return { title: 'UX42 Studio' };

    return {
        title: `${project.title} — Summary — ${profile.fullName}`,
        description: project.teaser ?? undefined,
    };
}

export default async function CaseShortPage({ params }: PageProps) {
    const { slug, projectSlug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Профиль
    const profile = await db.query.profiles.findFirst({
        where: { slug },
        columns: {
            id: true,
            slug: true,
            fullName: true,
            headline: true,
        },
        with: {
            socialLinks: { orderBy: { order: 'asc' } },
        },
    });
    if (!profile) notFound();

    // Проект (только опубликованный)
    const project = await db.query.projects.findFirst({
        where: {
            profileId: profile.id,
            slug: projectSlug,
            status: 'published',
        },
        with: {
            coverFile: true,
            projectCategories: { with: { category: true } },
        },
    });
    if (!project) notFound();

    // Параллельная загрузка: ассеты (showcase) + key metrics
    const [assets, keyMetrics] = await Promise.all([
        db.query.projectAssets.findMany({
            where: { projectId: project.id },
            with: { file: true },
            orderBy: { order: 'asc' },
        }),
        db.query.projectKeyMetrics.findMany({
            where: { projectId: project.id },
            orderBy: { order: 'asc' },
        }),
    ]);

    // ---- Производные данные ----

    const categories = project.projectCategories
        .map((pc) => pc.category?.name)
        .filter((name): name is string => !!name);

    const coverUrl = project.coverFile
        ? getImageUrl(project.coverFile.r2Key)
        : undefined;

    // Метаданные-строка: «B2B · 2024 · 3 months · Lead UX Designer»
    const metaParts = [
        project.client,
        project.year?.toString(),
        project.duration,
        project.myRole,
    ].filter(Boolean);
    const metadata = metaParts.join(' · ');

    // Топ-3 метрики (уже отсортированы по order)
    const metrics = keyMetrics.slice(0, 3).map((m) => ({
        value: m.value,
        description: m.description,
    }));

    // 2–4 ключевых экрана из final_gallery
    const keyScreens = assets
        .filter((a) => a.assetType === 'final_gallery')
        .slice(0, 4)
        .map((a) => ({
            id: a.id,
            url: a.file?.r2Key ? getImageUrl(a.file.r2Key) : undefined,
            caption: a.caption,
            alt: a.caption ?? undefined,
        }));

    const socialLinks = profile.socialLinks
        .slice(0, 5)
        .map((l) => ({
            platform: l.platform,
            title: l.title,
            url: l.url,
        }));

    return (
        // print-short — scope для @media print (globals.css): печать/PDF
        <div className='print-short min-h-screen bg-surface-container-low'>
            {/* Шапка — breadcrumb-вариант, как на полном кейсе (фидбэк
                2026-09-18: Work/About на глубокой странице не работают —
                это якоря страницы профиля; здесь место занято крошками). */}
            <SiteHeaderBreadcrumb
                profileSlug={slug}
                displayName={profile.fullName}
                currentTitle={project.title}
                ctaLabel='Hire me'
                ctaHref='#contact'
            />
            <CaseShortView
                profileSlug={slug}
                profileName={profile.fullName}
                projectSlug={project.slug}
                title={project.title}
                teaser={project.teaser}
                coverUrl={coverUrl}
                categories={categories}
                metadata={metadata}
                problemSnippet={project.problemStatement}
                goal={project.projectGoal}
                metrics={metrics}
                keyScreens={keyScreens}
                takeaway={project.keyTakeaway}
            />
            <SiteFooter
                profileSlug={slug}
                profileName={profile.fullName}
                profileHeadline={profile.headline}
                socialLinks={socialLinks}
            />
            {/* Плавающая «Скачать PDF» (window.print). useSearchParams
                требует Suspense-границы на статическом роуте. ?print=1 —
                автозапуск диалога (кнопка «Скачать PDF» на Review-шаге). */}
            <Suspense fallback={null}>
                <PrintTldrButton />
            </Suspense>
        </div>
    );
}
