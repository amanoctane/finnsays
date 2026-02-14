import { Metadata } from 'next';
import MarketsClient from './MarketsClient';
import { getMarketData } from '@/lib/data/market-data';

export const metadata: Metadata = {
    title: 'All Markets',
    description:
        'Explore real-time market data for stocks, cryptocurrencies, precious metals & commodities. Sort, filter, and analyze 100+ assets with institutional-grade tools.',
};

export const revalidate = 60;

export default async function MarketsPage() {
    const marketData = await getMarketData();
    return <MarketsClient initialData={marketData} />;
}
