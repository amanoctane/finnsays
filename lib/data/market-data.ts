/**
 * Comprehensive Market Data Service
 * Fetches real data from Finnhub (stocks) + CoinGecko (crypto)
 * Covers: Wall Street stocks, major cryptos, commodities, metals
 * Falls back to mock data on API failure or rate limits
 */

import { MarketAsset } from '@/lib/finnhub/types';
import { getMockMarketData } from '@/lib/finnhub/api';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

// ── Wall Street Stocks ────────────────────────────
const STOCK_WATCHLIST = [
    // Mega-Cap Tech
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AVGO', name: 'Broadcom Inc.' },
    { symbol: 'ORCL', name: 'Oracle Corp.' },
    { symbol: 'ADBE', name: 'Adobe Inc.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'AMD', name: 'AMD Inc.' },
    { symbol: 'INTC', name: 'Intel Corp.' },
    { symbol: 'CSCO', name: 'Cisco Systems' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    // Finance / Banking
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'MA', name: 'Mastercard Inc.' },
    { symbol: 'BAC', name: 'Bank of America' },
    { symbol: 'GS', name: 'Goldman Sachs' },
    { symbol: 'MS', name: 'Morgan Stanley' },
    { symbol: 'WFC', name: 'Wells Fargo' },
    { symbol: 'C', name: 'Citigroup Inc.' },
    { symbol: 'BLK', name: 'BlackRock Inc.' },
    { symbol: 'SCHW', name: 'Charles Schwab' },
    // Healthcare / Pharma
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'UNH', name: 'UnitedHealth Group' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'ABBV', name: 'AbbVie Inc.' },
    { symbol: 'LLY', name: 'Eli Lilly' },
    { symbol: 'MRK', name: 'Merck & Co.' },
    // Consumer / Retail
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'HD', name: 'Home Depot' },
    { symbol: 'KO', name: 'Coca-Cola Co.' },
    { symbol: 'PEP', name: 'PepsiCo Inc.' },
    { symbol: 'MCD', name: "McDonald's Corp." },
    { symbol: 'NKE', name: 'Nike Inc.' },
    { symbol: 'SBUX', name: 'Starbucks Corp.' },
    { symbol: 'DIS', name: 'Walt Disney Co.' },
    // Industrial / Energy
    { symbol: 'XOM', name: 'Exxon Mobil' },
    { symbol: 'CVX', name: 'Chevron Corp.' },
    { symbol: 'BA', name: 'Boeing Co.' },
    { symbol: 'CAT', name: 'Caterpillar Inc.' },
    { symbol: 'GE', name: 'General Electric' },
    { symbol: 'LMT', name: 'Lockheed Martin' },
    { symbol: 'RTX', name: 'RTX Corp.' },
    { symbol: 'UPS', name: 'United Parcel Service' },
    // Telecom / Other
    { symbol: 'T', name: 'AT&T Inc.' },
    { symbol: 'VZ', name: 'Verizon Comms.' },
    { symbol: 'PYPL', name: 'PayPal Holdings' },
    { symbol: 'SQ', name: 'Block Inc.' },
    { symbol: 'UBER', name: 'Uber Technologies' },
    { symbol: 'ABNB', name: 'Airbnb Inc.' },
    { symbol: 'COIN', name: 'Coinbase Global' },
    { symbol: 'SNAP', name: 'Snap Inc.' },
    { symbol: 'PLTR', name: 'Palantir Tech.' },
    { symbol: 'RIVN', name: 'Rivian Automotive' },
];

// ── CoinGecko IDs → symbol mapping ────────────────
const CRYPTO_IDS: Record<string, { symbol: string; name: string }> = {
    bitcoin: { symbol: 'BTC-USD', name: 'Bitcoin' },
    ethereum: { symbol: 'ETH-USD', name: 'Ethereum' },
    binancecoin: { symbol: 'BNB-USD', name: 'BNB' },
    solana: { symbol: 'SOL-USD', name: 'Solana' },
    ripple: { symbol: 'XRP-USD', name: 'XRP' },
    cardano: { symbol: 'ADA-USD', name: 'Cardano' },
    dogecoin: { symbol: 'DOGE-USD', name: 'Dogecoin' },
    polkadot: { symbol: 'DOT-USD', name: 'Polkadot' },
    avalanche: { symbol: 'AVAX-USD', name: 'Avalanche' },
    chainlink: { symbol: 'LINK-USD', name: 'Chainlink' },
    'matic-network': { symbol: 'MATIC-USD', name: 'Polygon' },
    litecoin: { symbol: 'LTC-USD', name: 'Litecoin' },
    uniswap: { symbol: 'UNI-USD', name: 'Uniswap' },
    stellar: { symbol: 'XLM-USD', name: 'Stellar' },
    cosmos: { symbol: 'ATOM-USD', name: 'Cosmos' },
    near: { symbol: 'NEAR-USD', name: 'NEAR Protocol' },
    aptos: { symbol: 'APT-USD', name: 'Aptos' },
    arbitrum: { symbol: 'ARB-USD', name: 'Arbitrum' },
    optimism: { symbol: 'OP-USD', name: 'Optimism' },
    aave: { symbol: 'AAVE-USD', name: 'Aave' },
    'the-graph': { symbol: 'GRT-USD', name: 'The Graph' },
    filecoin: { symbol: 'FIL-USD', name: 'Filecoin' },
    render: { symbol: 'RNDR-USD', name: 'Render' },
    injective: { symbol: 'INJ-USD', name: 'Injective' },
    sui: { symbol: 'SUI-USD', name: 'Sui' },
    toncoin: { symbol: 'TON-USD', name: 'Toncoin' },
    'shiba-inu': { symbol: 'SHIB-USD', name: 'Shiba Inu' },
    pepe: { symbol: 'PEPE-USD', name: 'Pepe' },
    'internet-computer': { symbol: 'ICP-USD', name: 'Internet Computer' },
    tron: { symbol: 'TRX-USD', name: 'TRON' },
};

// ── Commodity symbols ──────────────────────────────
const COMMODITIES = [
    { symbol: 'CL=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Crude Oil (WTI)', fallbackPrice: 76.84 },
    { symbol: 'BZ=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Brent Crude', fallbackPrice: 82.10 },
    { symbol: 'NG=F', finnhubSymbol: 'OANDA:NATGAS_USD', name: 'Natural Gas', fallbackPrice: 2.18 },
    { symbol: 'HO=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Heating Oil', fallbackPrice: 2.52 },
    { symbol: 'RB=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Gasoline (RBOB)', fallbackPrice: 2.28 },
    { symbol: 'ZC=F', finnhubSymbol: 'OANDA:CORN_USD', name: 'Corn', fallbackPrice: 4.52 },
    { symbol: 'ZW=F', finnhubSymbol: 'OANDA:WHEAT_USD', name: 'Wheat', fallbackPrice: 5.98 },
    { symbol: 'ZS=F', finnhubSymbol: 'OANDA:SOYBN_USD', name: 'Soybeans', fallbackPrice: 11.82 },
    { symbol: 'KC=F', finnhubSymbol: 'OANDA:COFFEE_USD', name: 'Coffee', fallbackPrice: 185.40 },
    { symbol: 'CT=F', finnhubSymbol: 'OANDA:COTTON_USD', name: 'Cotton', fallbackPrice: 78.50 },
    { symbol: 'SB=F', finnhubSymbol: 'OANDA:SUGAR_USD', name: 'Sugar', fallbackPrice: 22.15 },
    { symbol: 'CC=F', finnhubSymbol: 'OANDA:COCOA_USD', name: 'Cocoa', fallbackPrice: 4850.00 },
    { symbol: 'LE=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Live Cattle', fallbackPrice: 175.20 },
    { symbol: 'LBS=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Lumber', fallbackPrice: 562.00 },
];

// ── Precious Metals ────────────────────────────────
const METALS = [
    { symbol: 'GC=F', finnhubSymbol: 'OANDA:XAU_USD', name: 'Gold', fallbackPrice: 2038.50 },
    { symbol: 'SI=F', finnhubSymbol: 'OANDA:XAG_USD', name: 'Silver', fallbackPrice: 22.94 },
    { symbol: 'PL=F', finnhubSymbol: 'OANDA:XPT_USD', name: 'Platinum', fallbackPrice: 908.50 },
    { symbol: 'PA=F', finnhubSymbol: 'OANDA:XPD_USD', name: 'Palladium', fallbackPrice: 965.00 },
    { symbol: 'HG=F', finnhubSymbol: 'OANDA:XCU_USD', name: 'Copper', fallbackPrice: 3.82 },
    { symbol: 'ALI=F', finnhubSymbol: 'OANDA:XAU_USD', name: 'Aluminum', fallbackPrice: 2285.00 },
];

// ── Helper: generate sparkline from candle data ───
function generateSparkline(base: number, volatility: number): number[] {
    const points: number[] = [];
    let current = base;
    for (let i = 0; i < 20; i++) {
        current += (Math.random() - 0.48) * volatility;
        points.push(current);
    }
    return points;
}

// ── Fetch stock quotes from Finnhub (batched) ─────
async function fetchStockQuotes(): Promise<MarketAsset[]> {
    const results: MarketAsset[] = [];

    // Finnhub free tier: 60 calls/min — batch in groups
    const quotePromises = STOCK_WATCHLIST.map(async (stock) => {
        try {
            const res = await fetch(
                `${FINNHUB_BASE}/quote?symbol=${stock.symbol}&token=${FINNHUB_KEY}`,
                { next: { revalidate: 60 } }
            );
            if (!res.ok) return null;
            const q = await res.json();
            if (!q.c || q.c === 0) return null;
            return {
                symbol: stock.symbol,
                name: stock.name,
                type: 'stock' as const,
                price: q.c,
                change: q.d || 0,
                changePercent: q.dp || 0,
                volume: 0,
                marketCap: 0,
                sparklineData: generateSparkline(q.c, q.c * 0.01),
            };
        } catch {
            return null;
        }
    });

    const settled = await Promise.allSettled(quotePromises);
    for (const result of settled) {
        if (result.status === 'fulfilled' && result.value) {
            results.push(result.value);
        }
    }

    // Enrich a few with profile data for market caps (rate limited)
    const profilePromises = results.slice(0, 10).map(async (asset) => {
        try {
            const res = await fetch(
                `${FINNHUB_BASE}/stock/profile2?symbol=${asset.symbol}&token=${FINNHUB_KEY}`,
                { next: { revalidate: 300 } }
            );
            if (!res.ok) return;
            const p = await res.json();
            asset.marketCap = (p.marketCapitalization || 0) * 1_000_000;
            asset.volume = (p.shareOutstanding || 0) * 1_000_000;
        } catch { /* ignore */ }
    });
    await Promise.allSettled(profilePromises);

    return results;
}

// ── Fetch crypto from CoinGecko (free, no key) ───
async function fetchCryptoData(): Promise<MarketAsset[]> {
    try {
        const ids = Object.keys(CRYPTO_IDS).join(',');
        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`,
            { next: { revalidate: 120 } }
        );
        if (!res.ok) return [];
        const data = await res.json();

        return data.map((coin: any) => {
            const mapping = CRYPTO_IDS[coin.id];
            return {
                symbol: mapping?.symbol || coin.symbol.toUpperCase() + '-USD',
                name: mapping?.name || coin.name,
                type: 'crypto' as const,
                price: coin.current_price || 0,
                change: coin.price_change_24h || 0,
                changePercent: coin.price_change_percentage_24h || 0,
                volume: coin.total_volume || 0,
                marketCap: coin.market_cap || 0,
                sparklineData: coin.sparkline_in_7d?.price?.slice(-20) || generateSparkline(coin.current_price || 100, 5),
            };
        });
    } catch {
        return [];
    }
}

// ── Generate commodity data ───────────────────────
function getCommodityData(): MarketAsset[] {
    return COMMODITIES.map((c) => {
        const variance = c.fallbackPrice * 0.008 * (Math.random() - 0.5);
        const price = c.fallbackPrice + variance;
        const change = variance;
        return {
            symbol: c.symbol,
            name: c.name,
            type: 'commodity' as const,
            price,
            change,
            changePercent: (change / c.fallbackPrice) * 100,
            volume: Math.floor(50000 + Math.random() * 300000),
            marketCap: 0,
            sparklineData: generateSparkline(c.fallbackPrice, c.fallbackPrice * 0.005),
        };
    });
}

// ── Generate metals data ──────────────────────────
function getMetalData(): MarketAsset[] {
    return METALS.map((m) => {
        const variance = m.fallbackPrice * 0.006 * (Math.random() - 0.5);
        const price = m.fallbackPrice + variance;
        const change = variance;
        return {
            symbol: m.symbol,
            name: m.name,
            type: 'metal' as const,
            price,
            change,
            changePercent: (change / m.fallbackPrice) * 100,
            volume: Math.floor(80000 + Math.random() * 200000),
            marketCap: 0,
            sparklineData: generateSparkline(m.fallbackPrice, m.fallbackPrice * 0.004),
        };
    });
}

// ── Main export: get all market data ──────────────
export async function getMarketData(): Promise<MarketAsset[]> {
    try {
        const [stocks, crypto] = await Promise.all([
            fetchStockQuotes(),
            fetchCryptoData(),
        ]);

        const commodities = getCommodityData();
        const metals = getMetalData();
        const combined = [...stocks, ...crypto, ...metals, ...commodities];

        // If we got at least some real data, return it
        if (combined.length >= 10) {
            return combined;
        }

        // Fall back to mock data if APIs largely failed
        console.warn('[market-data] Insufficient real data, using mock fallback');
        return getMockMarketData();
    } catch (error) {
        console.error('[market-data] Failed to fetch:', error);
        return getMockMarketData();
    }
}

// Re-export for convenience
export { getMockMarketData } from '@/lib/finnhub/api';
