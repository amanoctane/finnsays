import type { Metadata } from 'next';
import './globals.css';
import '../styles/water-ball.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { generateOrganizationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: {
    default: 'FinnSays | Institutional-Grade Market Intelligence',
    template: '%s | FinnSays',
  },
  description:
    'Track 100+ global stocks, cryptocurrencies, precious metals & commodities with real-time data, advanced charts, and institutional-grade analytics.',
  keywords: [
    'stock market',
    'cryptocurrency',
    'trading',
    'financial data',
    'real-time quotes',
    'market analysis',
    'precious metals',
    'commodities',
    'gold',
    'bitcoin',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FinnSays',
    description: 'Track 100+ global stocks, cryptocurrencies, precious metals & commodities with real-time institutional-grade analytics.',
  },
  twitter: {
    card: 'summary_large_image',
    description: 'Track 100+ global stocks, cryptos, metals & commodities with real-time analytics.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-black text-white font-sans antialiased selection:bg-[#0066FF] selection:text-white">
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
