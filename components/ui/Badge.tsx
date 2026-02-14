import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'neutral';
    size?: 'sm' | 'md';
    className?: string;
}

export default function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    className = ''
}: BadgeProps) {
    const variants = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        neutral: 'bg-white/5 text-white/60 border-white/10'
    };

    const sizes = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs'
    };

    return (
        <span className={`
            inline-flex items-center justify-center font-medium rounded-md border
            ${variants[variant]}
            ${sizes[size]}
            ${className}
        `}>
            {children}
        </span>
    );
}
