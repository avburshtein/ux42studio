import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    function Input(props, ref) {
        return (
            <input
                ref={ref}
                className='w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300'
                {...props}
            />
        );
    },
);

export default Input;
