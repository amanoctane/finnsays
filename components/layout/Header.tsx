'use client';

import Link from 'next/link';
import { useState } from 'react';
import MenuOverlay from './MenuOverlay';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 bg-transparent mix-blend-difference text-white">
                <div className="max-w-[1800px] mx-auto px-8 md:px-12 h-24 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-180 transition-transform duration-700">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white" />
                            <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="white" />
                        </svg>
                    </Link>

                    {/* Menu Trigger */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="text-[10px] font-medium tracking-[0.3em] uppercase hover:opacity-70 transition-opacity"
                    >
                        Menu
                    </button>
                </div>
            </header>

            <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
