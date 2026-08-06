import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
    return (
        <div
            className={`rounded-lg border border-slate-100 bg-white p-6 shadow-sm ${className}`}
            {...props}
        />
    );
}

export default Card;
