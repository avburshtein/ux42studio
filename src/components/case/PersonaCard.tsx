import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PersonaCardProps {
    nameAndAge: string;
    role: string;
    description: string;
    avatarUrl?: string;
    className?: string;
}

// Карточка персоны по спеке Figma: Persona Card (176:372)
// Layout VERTICAL: Label "USER PERSONA" → Avatar + Name/Role → Quote
export function PersonaCard({
    nameAndAge,
    role,
    description,
    avatarUrl,
    className,
}: PersonaCardProps) {
    return (
        <div
            className={cn(
                'flex w-full flex-col gap-5 rounded-lg bg-surface-container-lowest p-8 shadow-card',
                className,
            )}
        >
            {/* Section 1 — Label "USER PERSONA" */}
            <span className='text-label-sm uppercase tracking-[0.5px] text-primary-container'>
                User persona
            </span>

            {/* Section 2 — Avatar + Info row */}
            <div className='flex items-start gap-5'>
                {/* Avatar: 64×64 circle, bg surface-container-high */}
                {avatarUrl ? (
                    <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-container-high'>
                        <Image
                            src={avatarUrl}
                            alt={nameAndAge}
                            fill
                            sizes='64px'
                            className='object-cover'
                        />
                    </div>
                ) : (
                    <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-title-lg font-medium text-on-surface-variant'>
                        {nameAndAge.charAt(0)}
                    </div>
                )}

                {/* Name + Role */}
                <div className='flex min-w-0 flex-1 flex-col gap-2 overflow-hidden'>
                    <h3 className='font-display text-title-lg text-on-surface'>
                        {nameAndAge}
                    </h3>
                    <p className='text-body-md tracking-[0.25px] text-on-surface-variant'>
                        {role}
                    </p>
                </div>
            </div>

            {/* Section 3 — Quote with left border */}
            <div className='mt-5 border-l-2 border-primary-container/30 pl-4'>
                <p className='text-body-md tracking-[0.25px] text-on-surface-variant'>
                    {description}
                </p>
            </div>
        </div>
    );
}
