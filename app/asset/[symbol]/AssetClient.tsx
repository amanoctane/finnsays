'use client';

import { useState } from 'react';
import Link from 'next/link';
import CandlestickChart from '@/components/charts/CandlestickChart';
import TradingViewWidget from '@/components/charts/TradingViewWidget';
import ChartControls from '@/components/charts/ChartControls';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import FadeIn from '@/components/animations/FadeIn';
import { MarketAsset } from '@/lib/finnhub/types';
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from '@/lib/utils/formatters';

interface AssetClientProps {
    symbol: string;
    asset: MarketAsset | null;
    candleData: {
        time: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }[];
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 md:p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{label}</p>
            <p className="text-lg md:text-xl font-light text-white tabular-nums">{value}</p>
        </div>
    );
}

export default function AssetClient({ symbol, asset, candleData }: AssetClientProps) {
    const [chartRange, setChartRange] = useState('1M');
    const [chartSource, setChartSource] = useState<'tradingview' | 'custom'>('tradingview');

    if (!asset) {
        return (
            <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-16 text-center">
                <h1 className="text-3xl font-light mb-4">Asset Not Found</h1>
                <p className="text-white/50 mb-8">
                    Could not find data for symbol &quot;{symbol}&quot;.
                </p>
                <Link href="/markets">
                    <Button>Back to Markets</Button>
                </Link>
            </main>
        );
    }

    const isPositive = asset.change >= 0;
    const lastCandle = candleData[candleData.length - 1];

    return (
        <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
            {/* ── Breadcrumb ───────────────────────── */}
            <FadeIn>
                <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
                    <Link href="/" className="hover:text-white/60 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/markets" className="hover:text-white/60 transition-colors">
                        Markets
                    </Link>
                    <span>/</span>
                    <span className="text-white/60">{symbol}</span>
                </div>
            </FadeIn>

            {/* ── Hero ─────────────────────────────── */}
            <FadeIn>
                <section className="mb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-semibold text-white/70">
                                {symbol.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight animate-shimmer">
                                    {asset.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-lg text-white/50">{symbol}</p>
                                    <Badge>
                                        {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="text-left md:text-right">
                            <p className="text-4xl md:text-5xl lg:text-6xl font-light tabular-nums">
                                ${formatPrice(asset.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2 md:justify-end">
                                <Badge variant={isPositive ? 'success' : 'error'} className="text-sm px-3 py-1">
                                    {formatPercent(asset.changePercent)}
                                </Badge>
                                <span
                                    className={`text-lg font-light ${isPositive ? 'text-emerald-400' : 'text-red-400'
                                        }`}
                                >
                                    {isPositive ? '+' : ''}
                                    {asset.change.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">
                            ★ Watchlist
                        </Button>
                        <Button variant="outline" size="sm">
                            ↗ Share
                        </Button>
                        <Button variant="outline" size="sm">
                            ↓ Download
                        </Button>
                    </div>
                </section>
            </FadeIn>

            {/* ── Key Statistics ────────────────────── */}
            <FadeIn delay={0.05}>
                <section className="mb-10">
                    <h2 className="text-xl font-light mb-5 text-white/80">Key Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <StatCard label="Open" value={`$${formatPrice(lastCandle?.open || 0)}`} />
                        <StatCard label="High" value={`$${formatPrice(lastCandle?.high || 0)}`} />
                        <StatCard label="Low" value={`$${formatPrice(lastCandle?.low || 0)}`} />
                        <StatCard label="Volume" value={formatVolume(lastCandle?.volume || 0)} />
                        <StatCard label="Market Cap" value={formatMarketCap(asset.marketCap)} />
                        <StatCard label="Change" value={formatPercent(asset.changePercent)} />
                    </div>
                </section>
            </FadeIn>

            {/* ── Chart ─────────────────────────────── */}
            <FadeIn delay={0.1}>
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-light text-white/80">Price Chart</h2>
                            <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setChartSource('tradingview')}
                                    className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${chartSource === 'tradingview'
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/40 hover:text-white/60'
                                        }`}
                                >
                                    TradingView
                                </button>
                                <button
                                    onClick={() => setChartSource('custom')}
                                    className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${chartSource === 'custom'
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/40 hover:text-white/60'
                                        }`}
                                >
                                    Candlestick
                                </button>
                            </div>
                        </div>
                        {chartSource === 'custom' && (
                            <ChartControls selectedRange={chartRange} onRangeChange={setChartRange} />
                        )}
                    </div>
                    {chartSource === 'tradingview' ? (
                        <TradingViewWidget symbol={symbol} assetType={asset.type} height={550} />
                    ) : (
                        <CandlestickChart data={candleData} height={500} />
                    )}
                </section>
            </FadeIn>

            {/* ── About ─────────────────────────────── */}
            <FadeIn delay={0.15}>
                <section className="mb-10">
                    <h2 className="text-xl font-light mb-5 text-white/80">About {asset.name}</h2>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                        <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-6">
                            {asset.name} ({symbol}) is a {asset.type === 'stock' ? 'publicly traded company'
                                : asset.type === 'crypto' ? 'cryptocurrency'
                                    : asset.type === 'metal' ? 'precious metal'
                                        : 'commodity'} tracked on FinnSays with real-time price data
                            and interactive charting tools. The current price is $
                            {formatPrice(asset.price)} with a 24-hour change of{' '}
                            {formatPercent(asset.changePercent)}.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Badge>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</Badge>
                            {asset.marketCap > 0 && (
                                <Badge>Market Cap: {formatMarketCap(asset.marketCap)}</Badge>
                            )}
                        </div>
                    </div>
                </section>
            </FadeIn>

            {/* ── Back link ─────────────────────────── */}
            <FadeIn delay={0.2}>
                <div className="pt-4 pb-8">
                    <Link href="/markets">
                        <Button variant="ghost" size="sm">
                            ← Back to Markets
                        </Button>
                    </Link>
                </div>
            </FadeIn>
        </main>
    );
}
