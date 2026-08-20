import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionLabel } from './BlockLabel';

interface PersonaCardProps {
    nameAndAge: string;
    avatarUrl?: string;
    bio: string;
    painPoints: string;
    className?: string;
}

// Карточка персоны: аватар + имя/возраст + bio + User Scenario
// Figma: Persona Card (master 176:372), 1072×228, radius=14
export function PersonaCard({
    nameAndAge,
    avatarUrl,
    bio,
    painPoints,
    className,
}: PersonaCardProps) {
    return (
        <div
            className={cn(
                'flex w-full gap-5 rounded-lg bg-surface-container-lowest p-8 shadow-card',
                className,
            )}
        >
            {avatarUrl ? (
                <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-variant'>
                    <Image
                        src={avatarUrl}
                        alt={nameAndAge}
                        fill
                        sizes='64px'
                        className='object-cover'
                    />
                </div>
            ) : (
                <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-variant text-title-lg font-medium text-on-surface-variant'>
                    {nameAndAge.charAt(0)}
                </div>
            )}

            <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <h3 className='font-display text-title-lg text-on-surface'>
                    {nameAndAge}
                </h3>
                <p className='text-body-md text-on-surface-variant'>{bio}</p>
                <div className='flex flex-col gap-1'>
                    <SectionLabel className='text-primary'>
                        User Scenario
                    </SectionLabel>
                    <p className='text-body-sm text-on-surface-variant'>
                        {painPoints}
                    </p>
                </div>
            </div>
        </div>
    );
}
