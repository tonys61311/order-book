/** One level of the order book: [price, size] (both are strings in BTSE’s feed). */
export type OrderLevel = [string, string];

export enum OrderBookUpdateType {
  Snapshot = 'snapshot',
  Delta = 'delta',
}

/** The core data payload returned under the `data` field. */
export interface OrderBookData {
  bids: OrderLevel[];        // Buy side
  asks: OrderLevel[];        // Sell side
  seqNum: number;            // Current message sequence
  prevSeqNum: number;        // Previous sequence
  type: OrderBookUpdateType; // 'snapshot' | 'delta'
  symbol: string;            // e.g. 'BTCPFC'
  timestamp: number;         // Unix ms
}
