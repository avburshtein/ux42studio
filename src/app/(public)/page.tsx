import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { PortfolioCard } from '@/components/PortfolioCard';
import { Carousel } from '@/components/portfolio/Carousel';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { ApproachSection } from '@/components/portfolio/ApproachSection';
import { SectionLabel } from '@/components/portfolio/SectionLabel';
import { FloatingElements } from '@/components/FloatingElements';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import {
    resolveStudioProfile,
} from '@/lib/studioProfile';
import AuthBar from '@/components/AuthBar';

export const revalidate = 300;

// Navigation divider — общий компонент SectionLabel (вынесен 2026-09-26,
// решение (69): разметка была продублирована в трёх местах).
const NavLabel = SectionLabel;

/**
 * Главная страница студии — визуальный язык страницы дизайнера
 * (Main_page_Spec), контент: Hero + Work (только кейсы профиля студии,
 * решение (69)) + Approach + Studio (About-стиль: визуал + статы) + CTA.
 *
 * Решение (69), 2026-09-26 — приоритет «студия» над «платформа»:
 * − блок Platform Benefits убран с главной и переехал на /platform;
 * − Work показывает кейсы профиля студии (slug из STUDIO_PROFILE_SLUG),
 *   а не общий каталог платформы;
 * − чипы категорий строятся по фактическим работам студии.
 *
 * Решения (19) и (22), 2026-09-02/04: каталог проектов на главной.
 */
export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env.DB);

    // Профиль студии (решение (69)): главная показывает только его кейсы.
    // resolveStudioProfile учитывает видимость: если профиль скрыт
    // (isPublic = 0), кейсы с главной пропадают вместе со ссылками на
    // страницу дизайнера — и не подставляется чужой профиль.
    const studioProfile = await resolveStudioProfile(db, env);

    const workProjects = studioProfile
        ? await db.query.projects.findMany({
              where: {
                  profileId: studioProfile.id,
                  status: 'published',
                  showOnHomepage: 1,
              },
              with: {
                  profile: {
                      columns: { slug: true, fullName: true, avatarFileId: true },
                  },
                  projectCategories: {
                      with: { category: true },
                  },
                  coverFile: true,
              },
              orderBy: { publishedAt: 'desc' },
              limit: 100,
          })
        : [];

    // Чипы категорий — только по тем, что реально встречаются в работах
    // студии (решение (69)). Раньше выводились все категории платформы,
    // и клик по «System Architecture» давал пустую сетку с надписью
    // «No published projects yet».
    const usedCategoryIds = new Set(
        workProjects.flatMap((p) =>
            p.projectCategories.map((pc) => pc.categoryId),
        ),
    );

    const allCategories = (await db.query.categories.findMany({
        orderBy: { order: 'asc' },
    })).filter((c) => usedCategoryIds.has(c.id));

    const selectedCategory = category
        ? allCategories.find((c) => c.slug === category)
        : undefined;

    const filteredProjects = selectedCategory
        ? workProjects.filter((p) =>
              p.projectCategories.some(
                  (pc) => pc.category?.slug === selectedCategory.slug,
              ),
          )
        : workProjects;

    // Карточка нового стиля требует обложку — проекты без неё не рендерим
    const cards = filteredProjects.filter((p) => p.coverFile);

    const chipClass = (selected: boolean) =>
        selected
            ? 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-primary bg-surface-tint shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-surface/8 transition-colors duration-150 ease-out hover:bg-[rgba(11,110,79,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

    return (
        <>
            <AuthBar />
            <SiteHeader
                wordmarkText='UX42.studio'
                wordmarkHref='/'
                navItems={[
                    { label: 'Work', href: '#work' },
                    { label: 'About', href: '#studio' },
                ]}
                menuMode
                ctaHref='#contact'
            />
            <main>
                <HeroSection
                    headlinePart1='We design for the moment'
                    headlineAccent='when everything'
                    headlinePart2='just clicks'
                    subtitle='UX42.studio is a product design studio. We help teams ship clear, human interfaces — from first sketch to final pixel.'
                    primaryCtaLabel='View our work'
                    primaryCtaHref='#work'
                    secondaryCtaLabel='Get in touch'
                    secondaryCtaHref='#contact'
                />

                {/* Work — каталог проектов (Main_page_Spec §6 паттерн) */}
                <section id='work' className='bg-surface-container-lowest py-12 md:py-24'>
                    <div className='section-container flex flex-col items-center gap-16'>
                        <NavLabel label='Work' />
                        <div className='flex flex-col items-center gap-8 text-center'>
                            <h2 className='font-display text-[32px] font-medium leading-[40px] text-on-surface lg:text-display-sm lg:leading-tight'>
                                Selected work
                            </h2>
                            <p className='max-w-[734px] text-body-lg text-on-surface-variant'>
                                Projects we are proud of — each one a full case
                                study with process, results and lessons.
                            </p>
                            {studioProfile && (
                                /* Ссылка на личную страницу основателя:
                                    главная студии и страница дизайнера —
                                    разные аудитории (решение (69)). */
                                <Link
                                    href={`/u/${studioProfile.slug}`}
                                    className='inline-flex items-center gap-2 text-body-md font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
                                >
                                    See the full case library
                                    <ArrowRight
                                        size={18}
                                        aria-hidden='true'
                                    />
                                </Link>
                            )}
                        </div>

                        {allCategories.length > 0 && (
                            <div className='hidden flex-wrap justify-center gap-3 md:flex'>
                                <Link
                                    href='/'
                                    scroll={false}
                                    className={chipClass(!selectedCategory)}
                                    aria-current={!selectedCategory || undefined}
                                >
                                    All
                                </Link>
                                {allCategories.map((cat) => {
                                    const active =
                                        selectedCategory?.slug === cat.slug;
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/?category=${encodeURIComponent(cat.slug)}#work`}
                                            scroll={false}
                                            className={chipClass(active)}
                                            aria-current={active || undefined}
                                        >
                                            {cat.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {cards.length === 0 ? (
                            <div className='py-16 text-body-lg text-on-surface-variant'>
                                {/* Публичных кейсов пока нет — вместо сухого
                                    «No published projects yet» объясняем, что
                                    происходит: сайт в разработке, галерея
                                    наполняется, скоро будут проекты (тон §6.2:
                                    первое лицо во множественном числе, без
                                    канцелярита). */}
                                <p>
                                    Still in development — we’re filling
                                    the gallery with projects worth seeing.
                                    They’ll be here very soon.
                                </p>
                            </div>
                        ) : (
                            /* <sm — карусель (решение (34): карточки главной и страницы
                                дизайнера идентичны: ширина 327 @375 = ширине сетки,
                                сосед виден до края экрана), ≥sm — сетка 2/3 */
                            <Carousel>
                                {cards.map((project) => (
                                    <PortfolioCard
                                        key={project.id}
                                        title={project.title}
                                        tag={
                                            project.profile?.fullName ??
                                            project.projectCategories[0]?.category?.name ??
                                            'Case study'
                                        }
                                        imageUrl={`/r2/${project.coverFile!.r2Key}`}
                                        href={`/u/${project.profile?.slug ?? 'unknown'}/${project.slug}`}
                                        overlayTags={project.projectCategories
                                            .map((pc) => pc.category?.name)
                                            .filter((n): n is string => Boolean(n))}
                                    />
                                ))}
                            </Carousel>
                        )}
                    </div>
                </section>

                {/* Обёртка Approach + Studio (решение (72)). Боке ставится
                    здесь, а не внутри ApproachSection, потому что оно должно
                    идти ОТ NavLabel Approach ДО NavLabel Studio — то есть
                    пересекать границу между двумя секциями. Внутри одной
                    секции его обрезал бы overflow-hidden.

                    Границы слоя задаёт класс .bokeh-band в globals.css
                    (решение (73)): отрицательные inset-утилиты Tailwind
                    (`bottom-[-112px]`) в этом проекте НЕ генерируются — слой
                    терял нижнюю границу, схлопывался по высоте, и пятна
                    разбрасывались по всей странице вместо полосы между
                    секциями. Обычный CSS от JIT-сканирования не зависит.

                    Границы: top = верхний padding Approach (48/96/120),
                    чтобы надпись «Approach» и воздух над ней остались чистыми.
                    bottom = −(верхний padding Studio + высота NavLabel 16px) —
                    боке заходит в отступ между секциями и доходит ровно до
                    подписи «Studio», не задевая её саму.

                    overflow-hidden на обёртке: обрезает боке по краям экрана.
                    Секции прозрачные, фон перенесён на обёртку, иначе они
                    перекрыли бы слой. */}
                <div className='relative overflow-hidden bg-surface-container-lowest'>
                    <div aria-hidden className='bokeh-band'>
                        {/* bounded: полоса узкая, и без зажима элементы
                            выходили бы за её края (свободный режим гуляет
                            от −10% до 110% и переносится на другую сторону). */}
                        <FloatingElements
                            count={14}
                            minBlur={12}
                            maxBlur={32}
                            bounded
                        />
                    </div>

                    <ApproachSection />

                    {/* Распорка: бывший верхний padding Studio (py-12 / md:py-24),
                        вынесенный из секции. Обёртка заканчивается здесь, поэтому
                        `bottom: 0` у .bokeh-band приходится ровно на верх
                        подписи «Studio» — полоса не заходит на неё (решение (74)).
                        Высота равна md:py-24, поэтому вертикальный ритм между
                        блоками не изменился. */}
                    <div aria-hidden className='h-12 md:h-24' />
                </div>

                {/* Studio — команда и подход студии. Решение (70):
                    фото /studio-2.webp удалено. На его месте — карточки двух
                    основателей: текст о «редком сочетании» из соседнего
                    абзаца превращён в конкретные факты с именами, а буллеты
                    «Our background» разложены по тем же карточкам. Так блок
                    отвечает на вопрос посетителя «кто вы такие» без
                    сгенерированной сток-фотографии, на которой нечитаемый
                    текст выдавал бы ИИ. Статы — факты: Google UX Certificate,
                    MSc Psychology, NGO-проекты (Design for good баннер убран
                    2026-09-12). */}
                {/* Верхний padding перенесён в распорку внутри обёртки (решение
                    (74)) — на фоне боке он больше не нужен. Нижний остаётся:
                    он отделяет Studio от CTA. Фон свой, т.к. секция вынесена
                    из-под обёртки. */}
                <section
                    id='studio'
                    className='relative scroll-mt-20 bg-surface-container-lowest pb-12 md:pb-24'
                >
                    <div className='section-container flex flex-col gap-16'>
                        <NavLabel label='Studio' />

                        {/* Шахматный ритм (решение (71)): у Approach заголовок
                            слева — здесь он справа, карточки напротив. Ритм
                            «текст ↔ факты» связывает блоки в одну историю и не
                            даёт странице превратиться в повтор. На мобильных
                            порядок прежний — заголовок, потом карточки. */}
                        <div className='flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16'>
                            {/* Два основателя — на месте фотографии студии */}
                            <ul className='order-2 flex flex-1 flex-col gap-6 lg:order-1 lg:max-w-[460px]'>
                                {[
                                    {
                                        role: 'Design & psychology',
                                        name: 'Aleksandra',
                                        lines: [
                                            'MSc in Psychology',
                                            'UX Research',
                                            'Google UX Design Certificate',
                                        ],
                                    },
                                    {
                                        role: 'Engineering & systems',
                                        name: 'Denis',
                                        lines: [
                                            'MD/PhD in Psychiatry',
                                            '8+ years MedTech engineering',
                                            'Next.js · TypeScript',
                                        ],
                                    },
                                ].map((member) => (
                                    <li
                                        key={member.name}
                                        className='team-card flex flex-col gap-3 rounded-[24px] p-7'
                                    >
                                        <span className='text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-primary'>
                                            {member.role}
                                        </span>
                                        <h3 className='font-display text-title-lg font-medium text-on-surface'>
                                            {member.name}
                                        </h3>
                                        <ul className='flex flex-col gap-1.5'>
                                            {member.lines.map((line) => (
                                                <li
                                                    key={line}
                                                    className='flex items-start gap-3 text-body-md text-on-surface-variant'
                                                >
                                                    <span
                                                        aria-hidden
                                                        className='mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary'
                                                    />
                                                    {line}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>

                            {/* Текст и заголовок — напротив карточек (справа на lg) */}
                            <div className='order-1 flex flex-1 flex-col gap-8 lg:order-2'>
                                <h2 className='max-w-[560px] bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
                                    Simple by design
                                </h2>

                                <div className='flex max-w-[560px] flex-col gap-4'>
                                    <p className='text-body-lg font-normal text-on-surface-variant'>
                                        We come to design with a live, open
                                        mind — always learning, always curious.
                                    </p>
                                    <p className='text-body-lg font-normal text-on-surface-variant'>
                                        We pursue design that is simple and
                                        functional to the point of genius — and
                                        mathematically beautiful. Psychology
                                        helps us understand people; engineering
                                        keeps the architecture honest.
                                    </p>
                                </div>

                                <p className='max-w-[560px] text-body-lg font-normal text-on-surface'>
                                    Behind UX42.studio is a rare combination of
                                    two disciplines. We don&apos;t just make
                                    things look good — we make them make sense.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Блок Platform Benefits убран с главной и живёт на /platform
                    (решение (69)). Отдельно убран и баннер «For designers»
                    перед CTA: платформа пока в закрытом бета-тесте, и
                    публичный призыв «Build it here» обещает то, чего
                    пока нет — отбор тестеров идёт вручную. Вход остался
                    только в футере (SiteFooter showPlatformLink) —
                    ненавязчивый и не мешает витрине кейсов. Вернуть
                    промо на главную, когда платформа откроется. */}
                <CtaSection
                    title='Get in touch'
                    bodyLines={[
                        'Have a project in mind — or just want to say hi?',
                        'Tell us about it. We usually reply within 48 hours.',
                    ]}
                    emailHref='mailto:hello@ux42.studio'
                    emailLabel='Send an email'
                />
            </main>
            <SiteFooter
                profileHeadline='Product design studio'
                socialLinks={[]}
                showPlatformLink
            />
        </>
    );
}
