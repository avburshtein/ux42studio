'use client';

import { useEffect, useState } from 'react';
import { PortfolioCard } from '@/components/PortfolioCard';
import { Carousel } from '@/components/portfolio/Carousel';

/** Проект для витрины главной — сплющенные данные из page.tsx (server →
 *  client props; Drizzle-типы в клиентский бандл не утекают). */
export interface WorkGalleryCard {
    /** id проекта — React-ключ */
    id: string;
    /** slug проекта — ссылка карточки /u/{profileSlug}/{projectSlug} */
    projectSlug: string;
    title: string;
    /** Имя дизайнера — фолбэк тега карточки */
    profileName: string | null;
    profileSlug: string | null;
    /** r2Key обложки; null → карточка не рендерится */
    coverR2Key: string | null;
    /** Категории проекта (slug + name) — по slug идёт фильтрация */
    categories: { slug: string; name: string }[];
}

/** Категория-чип: только те, что реально встречаются в работах студии. */
export interface WorkGalleryCategory {
    id: string;
    slug: string;
    name: string;
}

interface WorkGalleryProps {
    cards: WorkGalleryCard[];
    categories: WorkGalleryCategory[];
}

const chipClass = (selected: boolean) =>
    selected
        ? 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-primary bg-surface-tint shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-surface/8 transition-colors duration-150 ease-out hover:bg-[rgba(11,110,79,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';


/**
 * Витрина работ главной: чипы категорий + карусель/сетка карточек.
 *
 * Раньше фильтрация была серверной (?category=slug в searchParams) — каждый
 * клик по чипу = отдельный SSR-рендер главной с запросами в D1, и сама
 * страница не могла быть пререндеренной.
 *
 * Теперь — клиентский компонент:
 *  - страница пререндерится целиком (ISR, revalidate=300), фильтр применяется
 *    после гидрации без запроса к серверу;
 *  - URL синхронизируется через history.replaceState (shareable
 *    /?category=slug сохраняется, чипы не дёргают RSC-навигацию);
 *  - начальный фильтр из URL применяется в useEffect: гидрация начинается
 *    с «All» — полная галерея в статическом HTML остаётся для ботов.
 */
export default function WorkGallery({ cards, categories }: WorkGalleryProps) {
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

    useEffect(() => {
        const fromUrl = new URLSearchParams(window.location.search).get(
            'category',
        );
        if (fromUrl && categories.some((c) => c.slug === fromUrl)) {
            setSelectedSlug(fromUrl);
        }
        // Чипы фиксированы на рендер страницы — effect нужен один раз.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectCategory = (slug: string | null) => {
        setSelectedSlug(slug);
        // replaceState: адрес остаётся shareable, но перехода и запроса
        // к серверу нет (в отличие от router.replace → RSC-запрос).
        const url = slug
            ? `/?category=${encodeURIComponent(slug)}#work`
            : '/#work';
        window.history.replaceState(null, '', url);
    };

    const visibleCards = selectedSlug
        ? cards.filter((card) =>
              card.categories.some((cat) => cat.slug === selectedSlug),
          )
        : cards;

    return (
        <>
            {categories.length > 0 && (
                <div className='hidden flex-wrap justify-center gap-3 md:flex'>
                    <button
                        type='button'
                        onClick={() => selectCategory(null)}
                        className={chipClass(!selectedSlug)}
                        aria-current={!selectedSlug || undefined}
                    >
                        All
                    </button>
                    {categories.map((cat) => {
                        const active = selectedSlug === cat.slug;
                        return (
                            <button
                                key={cat.id}
                                type='button'
                                onClick={() => selectCategory(cat.slug)}
                                className={chipClass(active)}
                                aria-current={active || undefined}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            )}

            {visibleCards.length === 0 ? (
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
                    {visibleCards.map((card) => (
                        <PortfolioCard
                            key={card.id}
                            title={card.title}
                            tag={
                                card.profileName ??
                                card.categories[0]?.name ??
                                'Case study'
                            }
                            imageUrl={`/r2/${card.coverR2Key}`}
                            href={`/u/${card.profileSlug ?? 'unknown'}/${card.projectSlug}`}
                            overlayTags={card.categories
                                .map((cat) => cat.name)
                                .filter((n): n is string => Boolean(n))}
                        />
                    ))}
                </Carousel>
            )}
        </>
    );
}

