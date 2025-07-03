import { UpdateOrderBookSocket } from '@/services/updateOrderBookSocket'
import { OrderBookUpdateType, type OrderBookData } from '@/types/orderBook'
import { defineStore } from 'pinia'

export interface Quote {
  price: number
  size: number
  cumulative?: number 
  isNew?: boolean // 新出現的價位
  deltaSize?: number // 與前一筆的差量，用來顯示漲跌
}

export const useOrderBookStore = defineStore('orderBook', {
  state: () => ({
    OrderBookData: null as OrderBookData | null,
    buys: [] as Quote[],   // 所有買單 socket回來 bids
    sells: [] as Quote[], // 所有賣單 socket回來 asks
    /* 用來標記「曾經出現過」的價位，方便做首亮效果 */
    buyHistory : new Set<number>(),
    sellHistory: new Set<number>(),
    updateOrderBookSocket: null as UpdateOrderBookSocket | null,
    symbol: 'BTCPFC', // 預設交易對
    grouping: 0,
  }),

  getters: {
    // 前8筆買單
    topBuys(state): Quote[] {
      let running = 0
      return [...state.buys]
        .sort((a, b) => b.price - a.price)    // 高 → 低
        .slice(0, 8)
        .map(q => ({
          ...q,
          cumulative: (running += q.size),  
        }))
    },
    // 前8筆賣單
    topSells(state): Quote[] {
      let running = 0
      return [...state.sells]
        .sort((a, b) => b.price - a.price)    // 高 → 低
        .slice(0, 8)
        .reverse()
        .map(q => ({
          ...q,
          cumulative: (running += q.size),
        }))
        .reverse()
    },
    /** 買 / 賣總量，給百分比 bar 用 */
    totalBuySize:  s => s.buys.reduce((t, q) => t + q.size, 0),
    totalSellSize: s => s.sells.reduce((t, q) => t + q.size, 0),
  },

  actions: {
    /* ---------- Snapshot ---------- */
    applySnapshot (payload: OrderBookData) {
      const { bids = [], asks = [] } = payload

      this.buys  = []
      this.sells = []
      this.buyHistory .clear()
      this.sellHistory.clear()

      bids.forEach(([p, s]) => {
        this.buys.push({ price: Number(p), size: Number(s) })
        this.buyHistory.add(Number(p))
      })

      asks.forEach(([p, s]) => {
        this.sells.push({ price: Number(p), size: Number(s) })
        this.sellHistory.add(Number(p))
      })
    },

    /* ---------- Delta ---------- */
    applyDelta (payload: OrderBookData) {
      // 先清除isNew 標記
      this.buys.forEach(q => q.isNew = false)
      this.sells.forEach(q => q.isNew = false)

      const { bids = [], asks = [] } = payload

      bids.forEach(([p, s]) =>
        this.upsert(this.buys, Number(p), Number(s)),
      )
      asks.forEach(([p, s]) =>
        this.upsert(this.sells, Number(p), Number(s)),
      )

      // 標記新價位
      this.topBuys.forEach(q => {
        if (this.buyHistory.has(q.price)) return;

        const idx = this.buys.findIndex(b => b.price === q.price)
        if (idx !== -1) this.buys[idx].isNew = true
        this.buyHistory.add(q.price) 
      })

      this.topSells.forEach(q => {
        if (this.sellHistory.has(q.price)) return;

        const idx = this.sells.findIndex(s => s.price === q.price)
        if (idx !== -1) this.sells[idx].isNew = true
        this.sellHistory.add(q.price)
      })
    },

    // 插入或更新價位
    upsert (
      book: Quote[],
      price: number,
      size: number,
    ) {
      const idx = book.findIndex(q => q.price === price)

      if (size === 0) {
        // 刪單
        if (idx !== -1) book.splice(idx, 1)
        return
      }

      if (idx === -1) {
        // 新價位
        book.push({ price, size })
      } else {
        const old = book[idx]
        old.deltaSize = size - old.size
        old.size = size
      }
    },

    /* ---------- Socket 鏈接 ---------- */
    async start () {
      if (this.updateOrderBookSocket) await this.stop() // 先斷舊線

      this.updateOrderBookSocket = new UpdateOrderBookSocket()
      await this.updateOrderBookSocket.connect()

      /* 監聽訊息 */
      this.updateOrderBookSocket.subscribeUpdate(
        this.symbol,
        this.grouping,
        (data: OrderBookData) => {
          this.OrderBookData = data

          if (data.type === OrderBookUpdateType.Snapshot) {
            this.applySnapshot(data)
          } else if (data.type === OrderBookUpdateType.Delta) {
            this.applyDelta(data)
          }
        },
      )
    },
    
    /** 停止監聽 */
    async stop() {
      if (this.updateOrderBookSocket) {
        await this.updateOrderBookSocket.unsubscribeUpdate(this.symbol, this.grouping);
        this.updateOrderBookSocket.disconnect();
        this.updateOrderBookSocket = null;
      }
    },
  },
})
