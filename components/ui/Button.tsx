import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-light tracking-wide transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50';

    const variants = {
        primary:
            'bg-[#6366F1] hover:bg-[#4F46E5] text-white border border-transparent',
        outline:
            'bg-transparent border border-white/15 text-white/70 hover:border-white/30 hover:bg-white/[0.03] hover:text-white',
        ghost:
            'bg-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
