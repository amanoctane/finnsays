import AssetClient from './AssetClient';
import { getAssetData, getCandles } from '@/lib/finnhub/api';
import { getMarketData } from '@/lib/data/market-data';
import { getMockCandleData } from '@/lib/finnhub/api';

export const revalidate = 60;

// Generate static params from our curated watchlist
export async function generateStaticParams() {
    const data = await getMarketData();
    return data.map((asset) => ({
        symbol: asset.symbol,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const allAssets = await getMarketData();
    const asset = allAssets.find((a) => a.symbol === symbol);

    if (!asset) {
        return { title: 'Asset Not Found' };
    }

    return {
        title: `${asset.symbol} Price - Live Chart & Data`,
        description: `Track ${asset.symbol} (${asset.name}) live price, view real-time charts, and analyze historical data. Current price: $${asset.price.toFixed(2)}.`,
        keywords: [
            `${asset.symbol} price`,
            `${asset.name}`,
            `${asset.symbol} chart`,
            'live stock price',
        ],
        openGraph: {
            title: `${asset.symbol} - ${asset.name} | FinSight`,
            description: `Live price and market data for ${asset.name}`,
            type: 'website',
        },
    };
}

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const allAssets = await getMarketData();
    const asset = allAssets.find((a) => a.symbol === symbol) || null;

    // Try real candle data from Finnhub, fall back to mock
    let candleData;
    try {
        const now = Math.floor(Date.now() / 1000);
        const monthAgo = now - 60 * 24 * 60 * 60;
        // Only fetch candles for stocks (Finnhub doesn't support crypto candles on free tier)
        if (asset && asset.type === 'stock') {
            const candles = await getCandles(symbol, 'D', monthAgo, now);
            if (candles.s === 'ok' && candles.t) {
                candleData = candles.t.map((time: number, index: number) => ({
                    time: new Date(time * 1000).toISOString().split('T')[0],
                    open: candles.o[index],
                    high: candles.h[index],
                    low: candles.l[index],
                    close: candles.c[index],
                    volume: candles.v[index],
                }));
            }
        }
    } catch (e) {
        console.warn('[asset] Candle fetch failed, using mock:', e);
    }

    if (!candleData || candleData.length === 0) {
        candleData = getMockCandleData();
    }

    // JSON-LD Schema
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: asset?.name || symbol,
        identifier: symbol,
        offers: {
            '@type': 'Offer',
            price: asset?.price || 0,
            priceCurrency: 'USD',
        },
        provider: {
            '@type': 'Organization',
            name: 'FinSight',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <AssetClient
                symbol={symbol}
                asset={asset}
                candleData={candleData}
            />
        </>
    );
}
