// src/services/tradeHistorySocket.ts
import { OrderBookSocket } from './orderBookSocket';
import { WS_ENDPOINT, WS_TOPIC } from '@/config/ws';
import type { TradeItem } from '@/types/trade';

export class TradeHistorySocket extends OrderBookSocket {
    constructor() {
        super(WS_ENDPOINT.PUBLIC);
    }

    subscribeHistory(symbol = 'BTCPFC', listener?: (d: TradeItem[]) => void) {
        const topic = WS_TOPIC.TRADE_HISTORY(symbol);
        return this.subscribe<TradeItem[]>(topic, listener);
    }

    unsubscribeHistory(symbol = 'BTCPFC') {
        const topic = WS_TOPIC.TRADE_HISTORY(symbol);
        return this.unsubscribe(topic);
    }

    resubscribeHistory(symbol = 'BTCPFC', listener?: (d: TradeItem[]) => void) {
        const topic = WS_TOPIC.TRADE_HISTORY(symbol);
        return this.resubscribe<TradeItem[]>(topic, listener);
    }
}
