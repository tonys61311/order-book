/* ─── WebSocket 基礎端點 ─── */
export const WS_ENDPOINT = {
  ORDERBOOK: 'wss://ws.btse.com/ws/oss/futures',
  PUBLIC   : 'wss://ws.btse.com/ws/futures',
} as const;

/* ─── Feed / Topic 模板 ─── */
export const WS_TOPIC = {
  ORDERBOOK_UPDATE: (symbol: string, grouping = 0) =>
    `update:${symbol}_${grouping}`,             // ex. update:BTCPFC_0
  TRADE_HISTORY:    (symbol: string) =>
    `tradeHistoryApi:${symbol}`,                // ex. tradeHistoryApi:BTCPFC
} as const;