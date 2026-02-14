'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.6,
    className = '',
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeInStagger({
    children,
    staggerDelay = 0.05,
}: {
    children: ReactNode[];
    staggerDelay?: number;
}) {
    return (
        <>
            {children.map((child, index) => (
                <FadeIn key={index} delay={index * staggerDelay}>
                    {child}
                </FadeIn>
            ))}
        </>
    );
}
