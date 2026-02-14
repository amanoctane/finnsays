'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const WaterBall = dynamic(() => import('@/components/effects/WaterBall'), { ssr: false });

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { number: '01', label: 'Home', href: '/' },
    { number: '02', label: 'Trading', href: '/markets' },
    { number: '03', label: 'Technology', href: '/technology' },
    { number: '04', label: 'Company', href: '/technology' },
    { number: '05', label: 'Contact', href: '/contact' },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 bg-black text-white overflow-hidden"
                >
                    {/* Background Elements */}
                    <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-60 pointer-events-none">
                        <WaterBall size={800} />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors z-50"
                    >
                        Close
                    </button>

                    {/* Menu Content */}
                    <div className="h-full flex flex-col justify-center px-12 md:px-24">
                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="group flex items-baseline gap-6 cursor-pointer"
                                >
                                    <span className="text-xs text-white/30 font-mono group-hover:text-[#0055FF] transition-colors duration-300">
                                        {item.number}
                                    </span>
                                    <Link href={item.href} onClick={onClose}>
                                        <motion.span
                                            className="text-6xl md:text-8xl font-light tracking-tight text-white block"
                                            whileHover={{ x: 20 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Footer Info */}
                        <div className="absolute bottom-12 right-12 text-right">
                            <div className="text-xs text-white/30 font-mono mb-2">Local Time | CH</div>
                            <div className="text-3xl font-mono text-white/50">
                                {new Date().toLocaleTimeString('en-US', { hour12: false })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
