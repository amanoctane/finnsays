export class FinnhubWebSocket {
    private ws: WebSocket | null = null;
    private subscribers: Map<string, Set<(data: any) => void>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor(private apiKey: string) { }

    connect() {
        if (typeof window === 'undefined') return;

        this.ws = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`);

        this.ws.onopen = () => {
            console.log('[WS] Connected');
            this.reconnectAttempts = 0;

            // Resubscribe
            this.subscribers.forEach((_, symbol) => {
                this.sendSubscribe(symbol);
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'trade' && data.data) {
                    data.data.forEach((trade: any) => {
                        const callbacks = this.subscribers.get(trade.s);
                        callbacks?.forEach((cb) => cb(trade));
                    });
                }
            } catch {
                // Ignore parse errors
            }
        };

        this.ws.onerror = (error) => {
            console.error('[WS] Error:', error);
        };

        this.ws.onclose = () => {
            console.log('[WS] Disconnected');
            this.attemptReconnect();
        };
    }

    subscribe(symbol: string, callback?: (data: any) => void) {
        if (callback) {
            if (!this.subscribers.has(symbol)) {
                this.subscribers.set(symbol, new Set());
            }
            this.subscribers.get(symbol)!.add(callback);
        }
        this.sendSubscribe(symbol);
    }

    unsubscribe(symbol: string, callback?: (data: any) => void) {
        if (callback) {
            this.subscribers.get(symbol)?.delete(callback);
            if (this.subscribers.get(symbol)?.size === 0) {
                this.subscribers.delete(symbol);
            }
        }

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
        }
    }

    private sendSubscribe(symbol: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

            console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        }
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
        this.subscribers.clear();
    }
}
