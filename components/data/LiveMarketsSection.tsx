'use client';

import { useState, useEffect } from 'react';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import Sparkline from '@/components/charts/Sparkline';
import { MarketAsset } from '@/lib/finnhub/types';

// Color map by asset type or symbol
const ACCENT_COLORS: Record<string, string> = {
    'BTC-USD': '#F7931A',
    'ETH-USD': '#627EEA',
    'BNB-USD': '#F3BA2F',
    'SOL-USD': '#9945FF',
    'XRP-USD': '#00AAE4',
    'ADA-USD': '#0033AD',
    'DOGE-USD': '#C3A634',
    'DOT-USD': '#E6007A',
    'AVAX-USD': '#E84142',
    'LINK-USD': '#2A5ADA',
    'MATIC-USD': '#8247E5',
    'LTC-USD': '#BFBBBB',
    'UNI-USD': '#FF007A',
    'ATOM-USD': '#2E3148',
    'NEAR-USD': '#00C1DE',
};

function getColor(symbol: string, type: string): string {
    if (ACCENT_COLORS[symbol]) return ACCENT_COLORS[symbol];
    if (type === 'stock') return '#0055FF';
    if (type === 'crypto') return '#8B5CF6';
    if (type === 'metal') return '#D4AF37';
    if (type === 'commodity') return '#10B981';
    return '#0055FF';
}

type TabType = 'all' | 'crypto' | 'stocks' | 'metals' | 'commodities';

export default function LiveMarketsSection() {
    const [assets, setAssets] = useState<MarketAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('all');

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/market-data');
                const json = await res.json();
                if (json.success && json.data) {
                    setAssets(json.data);
                }
            } catch (err) {
                console.error('Failed to fetch market data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchData, 60_000);
        return () => clearInterval(interval);
    }, []);

    const tabs: { key: TabType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'crypto', label: 'Crypto' },
        { key: 'stocks', label: 'Stocks' },
        { key: 'metals', label: 'Metals' },
        { key: 'commodities', label: 'Commodities' },
    ];

    const filtered = assets.filter((a) => {
        if (tab === 'all') return true;
        if (tab === 'crypto') return a.type === 'crypto';
        if (tab === 'stocks') return a.type === 'stock';
        if (tab === 'metals') return a.type === 'metal';
        if (tab === 'commodities') return a.type === 'commodity';
        return true;
    });

    // Show top 12 for the landing page
    const displayed = filtered.slice(0, 12);

    return (
        <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <span className="text-xs text-white/30 uppercase tracking-widest block mb-2">Live Data</span>
                    <h2 className="text-3xl md:text-4xl font-light text-white">Markets Overview</h2>
                    <p className="text-sm text-white/30 mt-2">
                        {assets.length} assets tracked across stocks, crypto, metals & commodities
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Real-time
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all duration-300 whitespace-nowrap ${tab === t.key
                                ? 'bg-[#0055FF]/20 border-[#0055FF]/40 text-[#0055FF]'
                                : 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white/60 hover:border-white/10'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-[160px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {displayed.map((asset, i) => (
                        <FadeIn key={asset.symbol} delay={i * 0.03}>
                            <Card
                                className="p-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-[#0055FF]/30 transition-all duration-500 group overflow-hidden"
                                noPadding
                            >
                                {/* Header */}
                                <div className="p-4 pb-0 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border"
                                                style={{
                                                    backgroundColor: `${getColor(asset.symbol, asset.type)}15`,
                                                    borderColor: `${getColor(asset.symbol, asset.type)}30`,
                                                    color: getColor(asset.symbol, asset.type),
                                                }}
                                            >
                                                {asset.symbol.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-white block leading-tight">
                                                    {asset.symbol.replace('-USD', '')}
                                                </span>
                                                <span className="text-[10px] text-white/30">{asset.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-base font-mono text-white">
                                            ${asset.price < 1
                                                ? asset.price.toFixed(4)
                                                : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className={`text-xs font-mono ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="px-2 pt-3 pb-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                    <Sparkline
                                        data={asset.sparklineData}
                                        color={getColor(asset.symbol, asset.type)}
                                        height={50}
                                    />
                                </div>

                                {/* Bottom accent line */}
                                <div
                                    className="h-[2px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `linear-gradient(to right, transparent, ${getColor(asset.symbol, asset.type)}60, transparent)`,
                                    }}
                                />
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            )}

            {/* View All link */}
            <div className="mt-8 text-center">
                <a
                    href="/markets"
                    className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                >
                    View All {assets.length} Assets →
                </a>
            </div>
        </section>
    );
}
