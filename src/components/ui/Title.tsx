import { type ReactNode } from 'react';

type TitleVariant = 'h2' | 'h3';

const variantStyles: Record<TitleVariant, string> = {
    h2: 'text-title-lg text-on-background',
    h3: 'text-title-md text-on-background',
};

export default function Title({
    children,
    variant = 'h2',
    className = '',
}: {
    children: ReactNode;
    variant?: TitleVariant;
    className?: string;
}) {
    const Tag = variant;
    return (
        <Tag className={`${variantStyles[variant]} ${className}`}>
            {children}
        </Tag>
    );
}
