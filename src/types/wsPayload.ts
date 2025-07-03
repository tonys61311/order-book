// src/types/wsPayload.ts
export interface WsEnvelope<T = unknown> {
  topic: string; // ex: 'update:BTCPFC_0', 'trade:ETHPFC'
  data: T;       // 真正 payload，由 topic 決定
  event?: 'subscribe' | 'unsubscribe'; // 可選，僅在訂閱/退訂時出現
  channel?: string[]; // 可選，僅在訂閱/退訂時
}
