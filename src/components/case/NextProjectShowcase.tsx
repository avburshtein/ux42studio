import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SectionLabel } from './BlockLabel';

interface NextProjectShowcaseProps {
    nextProject?: {
        slug: string;
        title: string;
        teaser?: string | null;
        coverUrl?: string;
    } | null;
    profileSlug: string;
    contactUrl?: string | null;
    className?: string;
}

// Next Project Showcase (ID: 198:1336) — 1200×704
// VERTICAL gap=48, pad=80/64/80/64
// ├── Divider line
// ├── CTA Content (H2 + body)
// ├── Button / Primary "Start Project"
// └── Next Project Card (1072×228, pad=40, radius=20)
export function NextProjectShowcase({
    nextProject,
    profileSlug,
    contactUrl,
    className,
}: NextProjectShowcaseProps) {
    return (
        <section
            className={cn(
                'section-container flex flex-col gap-8 py-16 md:gap-12 lg:py-20',
                className,
            )}
        >
            {/* Divider */}
            <hr className='w-full border-t border-outline-variant' />

            {/* CTA Content */}
            <div className='flex flex-col gap-6'>
                <h2 className='font-display text-headline-md text-on-surface'>
                    Let&apos;s work together.
                </h2>
                <p className='max-w-2xl text-body-md text-on-surface-variant'>
                    Let&apos;s discuss how we can streamline your product
                    experience and craft something users will love.
                </p>
            </div>

            {/* Primary Button — "Start Project" (Figma: Button / Primary, 166×58, radius=48) */}
            <Link
                href={contactUrl ?? `/u/${profileSlug}`}
                className='inline-flex h-[58px] w-fit items-center justify-center gap-2 rounded-5xl bg-primary px-8 text-label-lg font-medium text-on-primary transition-opacity hover:opacity-90'
            >
                Start Project
            </Link>

            {/* Next Project Card */}
            {nextProject && (
                <Link
                    href={`/u/${profileSlug}/${nextProject.slug}`}
                    className='group flex w-full items-center gap-4 rounded-2xl bg-surface-container-low p-6 shadow-card transition-colors hover:bg-surface-variant sm:gap-6 sm:p-8 lg:p-10'
                >
                    <div className='flex min-w-0 flex-1 flex-col gap-4'>
                        <div className='flex items-center gap-3'>
                            <SectionLabel className='text-primary'>
                                Up next
                            </SectionLabel>
                            <span className='text-label-md font-medium text-outline-variant'>
                                next case
                            </span>
                        </div>
                        <h3 className='font-display text-title-lg text-on-surface'>
                            {nextProject.title}
                        </h3>
                        {nextProject.teaser && (
                            <p className='text-body-md text-on-surface-variant'>
                                {nextProject.teaser}
                            </p>
                        )}
                    </div>

                    {/* Arrow icon */}
                    <svg
                        width='32'
                        height='32'
                        viewBox='0 0 32 32'
                        fill='none'
                        aria-hidden='true'
                        className='shrink-0 text-primary transition-transform group-hover:translate-x-1'
                    >
                        <path
                            d='M6.66663 16H25.3333M25.3333 16L16 6.66669M25.3333 16L16 25.3334'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>
                </Link>
            )}
        </section>
    );
}
