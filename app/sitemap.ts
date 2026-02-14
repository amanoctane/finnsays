import { MetadataRoute } from 'next';
import { getMockMarketData } from '@/lib/finnhub/api';
import { SITE_URL } from '@/lib/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    const assets = getMockMarketData();

    const assetUrls: MetadataRoute.Sitemap = assets.map((asset) => ({
        url: `${SITE_URL}/asset/${asset.symbol}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/markets`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        ...assetUrls,
    ];
}
