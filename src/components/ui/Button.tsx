import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost';
}

export function Button({
    variant = 'default',
    className = '',
    ...props
}: ButtonProps) {
    const base =
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors';
    const variants: Record<string, string> = {
        default: 'bg-sky-600 text-white hover:bg-sky-700',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    };
    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        />
    );
}

export default Button;
