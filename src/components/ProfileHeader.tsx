import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { MapPin, Globe, ExternalLink } from 'lucide-react';

type ProfileHeaderProps = {
    profile: {
        fullName: string;
        headline: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        avatarFile: { r2Key: string } | null;
        coverFile: { r2Key: string } | null;
        socialLinks: Array<{
            platform: string;
            title: string;
            url: string;
        }>;
    };
};

const ASSET_DOMAIN = 'https://assets.ux42.studio';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
    github: (
        <svg
            className='h-5 w-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
        >
            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
        </svg>
    ),
    behance: (
        <svg
            className='h-5 w-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
        >
            <path d='M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z' />
        </svg>
    ),
    dribbble: (
        <svg
            className='h-5 w-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
        >
            <path d='M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z' />
        </svg>
    ),
    telegram: (
        <svg
            className='h-5 w-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
        >
            <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.098.154.228.17.334.016.106.036.344.02.531z' />
        </svg>
    ),
};

function getPlatformIcon(platform: string): React.ReactNode {
    return (
        PLATFORM_ICONS[platform.toLowerCase()] ?? (
            <ExternalLink className='h-5 w-5' />
        )
    );
}

function getImageUrl(r2Key: string): string {
    return `${ASSET_DOMAIN}/${r2Key}`;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <header
            className='relative'
            aria-label={`${profile.fullName}'s profile`}
        >
            {/* Cover */}
            <div className='relative h-48 sm:h-64 w-full overflow-hidden rounded-b-xl'>
                {profile.coverFile ? (
                    <img
                        src={getImageUrl(profile.coverFile.r2Key)}
                        alt=''
                        className='h-full w-full object-cover'
                        aria-hidden='true'
                    />
                ) : (
                    <div className='h-full w-full bg-gradient-to-br from-[var(--md-sys-color-primary-container)] to-[var(--md-sys-color-secondary-container)]' />
                )}
            </div>

            {/* Avatar */}
            <div className='absolute left-1/2 -translate-x-1/2 -bottom-12 sm:left-8 sm:translate-x-0'>
                <Avatar className='h-24 w-24 border-4 border-[var(--md-sys-color-surface)] shadow-lg'>
                    {profile.avatarFile ? (
                        <AvatarImage
                            src={getImageUrl(profile.avatarFile.r2Key)}
                            alt={profile.fullName}
                        />
                    ) : null}
                    <AvatarFallback className='text-title-lg'>
                        {getInitials(profile.fullName)}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Info */}
            <div className='mt-14 sm:mt-4 sm:ml-36 px-4 sm:px-8 pb-6 space-y-3'>
                <div>
                    <h1 className='text-headline-sm text-[var(--md-sys-color-on-surface)]'>
                        {profile.fullName}
                    </h1>
                    {profile.headline && (
                        <p className='text-title-md text-[var(--md-sys-color-on-surface-variant)] mt-1'>
                            {profile.headline}
                        </p>
                    )}
                </div>

                {profile.bio && (
                    <p className='text-body-md text-[var(--md-sys-color-on-surface)] max-w-prose'>
                        {profile.bio}
                    </p>
                )}

                <div className='flex flex-wrap items-center gap-4 text-body-sm text-[var(--md-sys-color-on-surface-variant)]'>
                    {profile.location && (
                        <span className='flex items-center gap-1'>
                            <MapPin className='h-4 w-4' aria-hidden='true' />
                            {profile.location}
                        </span>
                    )}
                    {profile.website && (
                        <a
                            href={
                                profile.website.startsWith('http')
                                    ? profile.website
                                    : `https://${profile.website}`
                            }
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1 hover:text-[var(--md-sys-color-primary)] transition-colors'
                            aria-label={`Website: ${profile.website}`}
                        >
                            <Globe className='h-4 w-4' aria-hidden='true' />
                            {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                </div>

                {profile.socialLinks.length > 0 && (
                    <nav
                        className='flex items-center gap-3 pt-1'
                        aria-label='Social links'
                    >
                        {profile.socialLinks.map((link) => (
                            <a
                                key={`${link.platform}-${link.url}`}
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-1.5 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] transition-colors'
                                aria-label={`${link.title} (${link.platform})`}
                                title={link.title}
                            >
                                {getPlatformIcon(link.platform)}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
