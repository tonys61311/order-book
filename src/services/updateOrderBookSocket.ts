// src/services/updateOrderBookSocket.ts
import { OrderBookSocket } from './orderBookSocket';
import type { OrderBookData } from '@/types/orderBook';
import { WS_ENDPOINT, WS_TOPIC } from '@/config/ws';

export class UpdateOrderBookSocket extends OrderBookSocket {
  
  constructor() {
    super(WS_ENDPOINT.ORDERBOOK);
  }

  subscribeUpdate(symbol = 'BTCPFC', grouping = 0, listener?: (d: OrderBookData) => void) {
    const topic = WS_TOPIC.ORDERBOOK_UPDATE(symbol, grouping);
    return this.subscribe<OrderBookData>(topic, listener);
  }

  /** 取消訂閱 */
  unsubscribeUpdate(symbol = 'BTCPFC', grouping = 0) {
    const topic = WS_TOPIC.ORDERBOOK_UPDATE(symbol, grouping);
    return this.unsubscribe(topic);
  }

  resubscribeUpdate(symbol = 'BTCPFC', grouping = 0, listener?: (d: OrderBookData) => void) {
    const topic = WS_TOPIC.ORDERBOOK_UPDATE(symbol, grouping);
    return this.resubscribe<OrderBookData>(topic, listener);
  }
}
