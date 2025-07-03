/** BUY / SELL 方向 */
export enum TradeSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface TradeItem {
  symbol: string;
  side: TradeSide;
  size: number;
  price: number;
  tradeId: number;
  timestamp: number;
}