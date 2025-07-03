import { TradeHistorySocket } from '@/services/tradeHistorySocket'
import type { TradeItem } from '@/types/trade'
import { formatNumber } from '@/utils/number'
import { defineStore } from 'pinia'

/** 價格趨勢列舉 */
export enum PriceTrend {
  UP   = 'up',
  DOWN = 'down',
  SAME = 'same',
}

export const usePriceStore = defineStore('price', {
  state: () => ({
    last: 0,   // 最新成交價
    prev: 0,   // 前一筆價格
    tradeHistorySocket: null as TradeHistorySocket | null,
    symbol: 'BTCPFC', // 預設交易對
  }),

  getters: {
    /** 1️⃣ 漲跌判定 */
    trend(state): PriceTrend {
      if (state.last > state.prev) return PriceTrend.UP
      if (state.last < state.prev) return PriceTrend.DOWN
      return PriceTrend.SAME
    },
  },

  actions: {
    /** 更新最新成交價 */
    update(price: number) {
      this.prev = this.last
      this.last = price
    },

    /** 連線 + 訂閱，預設 BTCPFC */
    async start() {
      if (this.tradeHistorySocket) {
        await this.stop(); // 如果已經連線，先取消訂閱
      }

      this.tradeHistorySocket = new TradeHistorySocket();

      await this.tradeHistorySocket.connect();

      this.tradeHistorySocket.subscribeHistory(this.symbol, (data: TradeItem[]) => {
        if (data.length) this.update(data[0].price);
      });
    },

    /** 停止監聽 */
    async stop() {
      if (this.tradeHistorySocket) {
        await this.tradeHistorySocket.unsubscribeHistory(this.symbol);
        this.tradeHistorySocket.disconnect();
        this.tradeHistorySocket = null;
      }
    },
  },
})
