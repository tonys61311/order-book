// src/composables/useOrderBookRows.ts
import { computed } from 'vue'
import { useOrderBookStore } from '@/stores/orderBook'
import { tradeSideThemeMap } from '@/utils/tradeSideTheme'
import type { TableRowModel } from '@/types/tableViewModel'
import { TradeSide } from '@/types/trade'

export function getOrderBookContentRowsByTradeSide(side: TradeSide) {
  const obStore = useOrderBookStore()
  const theme = tradeSideThemeMap[side]

  return computed<TableRowModel[]>(() => {
    const quotes  = side === TradeSide.BUY ? obStore.topBuys  : obStore.topSells
    const totalSz = side === TradeSide.BUY ? obStore.totalBuySize : obStore.totalSellSize

    return quotes.map(q => ({
      id: q.price,
      rows: [
        { value: q.price, textClass: theme.priceTextClass, formatOptions: { minimumFractionDigits: 1 } },
        { value: q.size,  delta: q.deltaSize },
        {
          value: q.cumulative!,
          barPercent: ((q.cumulative! / totalSz) * 100).toFixed(2) + '%',
          barColor: theme.barBgColor,
        },
      ],
      isNew: q.isNew,
      highlightColor: theme.highlightColor,
    }))
  })
}

export const orderBookHeaderRow: TableRowModel = {
  id: 'header',
  rows: [
    { value: 'Price (USD)' },
    { value: 'Size' },
    { value: 'Total' },
  ],
}