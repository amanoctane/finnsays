'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import InfiniteTicker from '@/components/ui/InfiniteTicker';
import LiveMarketsSection from '@/components/data/LiveMarketsSection';
import NewsSection from '@/components/news/NewsSection';

const WaterBall = dynamic(() => import('@/components/effects/WaterBall'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />,
});

const FluidBackground = dynamic(() => import('@/components/effects/FluidBackground'), {
    ssr: false,
});

export default function HomeClient() {
    return (
        <main className="relative min-h-screen bg-black overflow-x-hidden">

            {/* ── Section 1: Hero ─────────────────────────────── */}
            <section className="relative h-screen flex items-center px-6 md:px-12 max-w-[1800px] mx-auto">
                <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Text Content */}
                    <div>
                        <FadeIn>
                            <h1 className="text-5xl md:text-7xl xl:text-8xl font-normal tracking-tighter leading-[1.1] text-white mb-8">
                                Systematic Intelligence. <br />
                                <span className="text-white/50">Digital Markets.</span>
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <p className="text-lg md:text-xl font-light text-white/40 max-w-lg leading-relaxed mb-10">
                                India-based proprietary firm using high-performance technology and algorithmic research to capture opportunities in global cryptocurrency markets with absolute precision.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <Link href="/markets">
                                <button className="px-8 py-4 rounded-full border border-white/20 text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                                    Learn More
                                </button>
                            </Link>
                        </FadeIn>
                    </div>

                    {/* Hero Orb */}
                    <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 scale-[1.1] md:scale-125 opacity-90">
                            <WaterBall size={600} />
                        </div>
                    </div>
                </div>

                {/* Vertical Text Side */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest py-4 px-1 writing-vertical-rl rotate-180">
                        Honors
                    </div>
                </div>
            </section>

            {/* ── Scrolling Ticker ─────────────────────────────── */}
            <InfiniteTicker />

            {/* ── Section 2: Why Algorithmic (Glass Cards) ────── */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto min-h-screen flex flex-col justify-center overflow-hidden">

                <div className="relative z-10 mb-16 md:mb-24 text-center">
                    <h2 className="text-4xl md:text-5xl font-light text-white mb-4">Why Algorithmic</h2>
                    <p className="text-white/40">The difference between reacting to markets and anticipating them.</p>
                </div>

                {/* Abstract Blop — Positioned to the right side, visible */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] z-0 pointer-events-none">
                    <motion.div
                        animate={{
                            y: [-30, 30, -30],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="relative w-[400px] h-[400px] lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px] opacity-50"
                    >
                        <FluidBackground className="rounded-full" />
                    </motion.div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1: The Challenge */}
                    <div className="relative group">
                        {/* Silver gradient border */}
                        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-white/10 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative min-h-[500px] bg-black/60 backdrop-blur-xl border-0 p-8 md:p-12 flex flex-col justify-between" noPadding>
                            <div>
                                <span className="text-xs text-white/30 uppercase tracking-widest mb-6 block">The Challenge</span>
                                <h3 className="text-3xl md:text-4xl font-light text-white leading-tight">
                                    Manual constraints and emotional bias.
                                </h3>
                            </div>

                            <div className="relative">
                                <p className="text-white/40 font-light leading-relaxed max-w-sm">
                                    Traditional trading is limited by human reaction times. Manual strategies suffer from inconsistency, emotional decision-making, and the physical inability to monitor hundreds of global symbols simultaneously.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Card 2: The Solution */}
                    <div className="relative group">
                        {/* Silver gradient border */}
                        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative min-h-[500px] bg-black/60 backdrop-blur-xl border-0 p-8 md:p-12 flex flex-col justify-between" noPadding>
                            <div>
                                <span className="text-xs text-white/30 uppercase tracking-widest mb-6 block">The Solution</span>
                                <h3 className="text-3xl md:text-4xl font-light text-white leading-tight">
                                    Systematic precision and global scale.
                                </h3>
                            </div>

                            <div className="relative">
                                <p className="text-white/40 font-light leading-relaxed max-w-sm">
                                    Our proprietary algorithms execute in milliseconds, eliminating bias and maintaining peak performance 24/7. High-density data processing allows for simultaneous execution across every global venue.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

            </section>

            {/* ── Section 3: Live Markets ───────────────────── */}
            <LiveMarketsSection />

            {/* ── Section 4: Market Intelligence (News) ───────── */}
            <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <span className="text-xs text-white/30 uppercase tracking-widest block mb-2">Live Feed</span>
                        <h2 className="text-3xl md:text-4xl font-light text-white">Market Intelligence</h2>
                    </div>
                    <Link href="/news" className="hidden md:block">
                        <button className="text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                            View All News →
                        </button>
                    </Link>
                </div>

                <NewsSection />
            </section>

            {/* ── CTA Section ─────────────────────────────────── */}
            <section className="py-24 md:py-32 px-6 md:px-12 border-t border-white/5">
                <div className="max-w-[1800px] mx-auto text-center">
                    <FadeIn>
                        <span className="text-xs text-white/20 uppercase tracking-widest block mb-6">Get Started</span>
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">We build beyond algorithms</h2>
                        <p className="text-white/35 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                            A proprietary synchronization gateway for global crypto futures markets.
                            Make a trade once and have it replicated instantly across every venue.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/markets">
                                <button className="px-8 py-4 rounded-full bg-[#0055FF] text-white text-sm uppercase tracking-widest hover:bg-[#0044CC] transition-all duration-300">
                                    Start Trading
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="px-8 py-4 rounded-full border border-white/15 text-white/60 text-sm uppercase tracking-widest hover:border-white/30 hover:text-white transition-all duration-300">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
