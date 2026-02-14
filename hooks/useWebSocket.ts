'use client';

import { useEffect, useRef, useState } from 'react';
import { FinnhubWebSocket } from '@/lib/finnhub/websocket';

export function useWebSocket(symbols: string[]) {
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<FinnhubWebSocket | null>(null);
    const symbolsKey = symbols.join(',');

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
        if (!apiKey || apiKey === 'your_finnhub_api_key_here') return;

        const ws = new FinnhubWebSocket(apiKey);
        wsRef.current = ws;

        ws.connect();
        setConnected(true);

        symbols.forEach((symbol) => {
            ws.subscribe(symbol, (trade) => {
                setPrices((prev) => ({
                    ...prev,
                    [trade.s]: trade.p,
                }));
            });
        });

        return () => {
            symbols.forEach((symbol) => ws.unsubscribe(symbol));
            ws.disconnect();
            setConnected(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbolsKey]);

    return { prices, connected };
}
