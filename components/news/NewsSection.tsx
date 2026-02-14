'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';

interface NewsItem {
    id: number;
    headline: string;
    source: string;
    datetime: number;
    image: string;
    summary: string;
    url: string;
}

// Mock News Data (Fallback)
const MOCK_NEWS: NewsItem[] = [
    {
        id: 1,
        headline: "Fed Signals Potential Rate Cuts Later This Year",
        source: "Bloomberg",
        datetime: Date.now() - 3600000,
        image: "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?q=80&w=800&auto=format&fit=crop",
        summary: "Federal Reserve officials indicated that inflation data is moving in the right direction.",
        url: "#"
    },
    {
        id: 2,
        headline: "Tech Stocks Rally on AI Breakthroughs",
        source: "Reuters",
        datetime: Date.now() - 7200000,
        image: "https://images.unsplash.com/photo-1611974765270-ca1258822981?q=80&w=800&auto=format&fit=crop",
        summary: "Major tech indices surged as new AI models were released by industry leaders.",
        url: "#"
    },
    {
        id: 3,
        headline: "Oil Prices Stabilize Amid Geopolitical Tensions",
        source: "CNBC",
        datetime: Date.now() - 10800000,
        image: "https://images.unsplash.com/photo-1518182383220-72973f536a65?q=80&w=800&auto=format&fit=crop",
        summary: "Crude oil futures held steady as markets assessed supply risks in the Middle East.",
        url: "#"
    },
    {
        id: 4,
        headline: "Global Markets Review: Asian Stocks Mixed",
        source: "Yahoo Finance",
        datetime: Date.now() - 14400000,
        image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop",
        summary: "Asian markets showed mixed results as investors awaited key economic data from China.",
        url: "#"
    }
];

export default function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
    const [loading, setLoading] = useState(false);

    // In a real implementation with Yahoo Finance API:
    // useEffect(() => {
    //   fetch('/api/news').then(res => res.json()).then(data => setNews(data));
    // }, []);

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-light text-white tracking-wide">
                    Market News
                </h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-white/50 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {news.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 0.1}>
                        <a href={item.url} className="group block h-full">
                            <Card className="h-full flex flex-col !p-0 bg-[#0A0A15]/60 hover:bg-[#0F0F20]/80 transition-colors border-white/5" noPadding>
                                <div className="relative h-40 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={item.image}
                                        alt={item.headline}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    />
                                    <span className="absolute bottom-3 left-4 z-20 text-[10px] uppercase tracking-widest text-[#0055FF] font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                                        {item.source}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-sm font-medium text-white/90 leading-snug mb-3 group-hover:text-[#0055FF] transition-colors line-clamp-2">
                                        {item.headline}
                                    </h3>
                                    <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4 flex-1">
                                        {item.summary}
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30">
                                        <span>{new Date(item.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="group-hover:translate-x-1 transition-transform">Read &rarr;</span>
                                    </div>
                                </div>
                            </Card>
                        </a>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
