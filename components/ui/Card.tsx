import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export default function Card({ children, className = '', noPadding = false }: CardProps) {
    return (
        <div className={`
            relative overflow-hidden rounded-2xl 
            bg-[#050510]/80 backdrop-blur-md 
            border border-white/[0.06] 
            shadow-xl shadow-black/20
            transition-all duration-300 hover:border-white/[0.1]
            ${noPadding ? '' : 'p-6'}
            ${className}
        `}>
            {/* Subtle top gloss */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

            {children}
        </div>
    );
}
