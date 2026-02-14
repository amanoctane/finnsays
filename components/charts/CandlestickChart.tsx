'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface CandlestickChartProps {
    data: CandleData[];
    height?: number;
}

export default function CandlestickChart({ data, height = 500 }: CandlestickChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' },
                textColor: 'rgba(255, 255, 255, 0.6)',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height,
            crosshair: {
                mode: 0,
                vertLine: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#0066FF',
                },
                horzLine: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#0066FF',
                },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });

        // v5 API: chart.addSeries(CandlestickSeries, options)
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#EF4444',
            borderUpColor: '#10B981',
            borderDownColor: '#EF4444',
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        candlestickSeries.setData(data as any);

        // Volume histogram
        const volumeData = data
            .filter((d) => d.volume !== undefined)
            .map((d) => ({
                time: d.time,
                value: d.volume!,
                color: d.close >= d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }));

        if (volumeData.length > 0) {
            const volumeSeries = chart.addSeries(HistogramSeries, {
                priceFormat: { type: 'volume' },
                priceScaleId: 'volume',
            });
            volumeSeries.priceScale().applyOptions({
                scaleMargins: { top: 0.8, bottom: 0 },
            });
            volumeSeries.setData(volumeData as any);
        }

        chart.timeScale().fitContent();
        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, height]);

    return (
        <div className="bg-black border border-white/10 rounded-2xl p-4 md:p-6">
            <div ref={chartContainerRef} />
        </div>
    );
}
