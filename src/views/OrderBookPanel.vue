<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { TableView, LastPriceBar } from '@/components'

import { usePriceStore } from '@/stores/price'
import { useOrderBookStore } from '@/stores/orderBook'

import type { TableRowModel } from '@/types/tableViewModel'
import { TradeSide } from '@/types/trade'
import { orderBookHeaderRow, getOrderBookContentRowsByTradeSide } from '@/composable/useOrderBookRows'

/* ---------- 連 Pinia ---------- */
const priceStore = usePriceStore()
const obStore = useOrderBookStore()

onMounted(async () => {
  await obStore.start();
  await priceStore.start();

  // setTimeout(() => {
  //   obStore.stop();
  //   priceStore.stop();
  // }, 5000);
});

onBeforeUnmount(() => {
  obStore.stop();
  priceStore.stop();
});

/* ---------- 表格資料 ---------- */
const headerRow: TableRowModel = orderBookHeaderRow;
const sellRows = getOrderBookContentRowsByTradeSide(TradeSide.SELL)
const buyRows  = getOrderBookContentRowsByTradeSide(TradeSide.BUY)
</script>

<template>
  <div class="flex h-full justify-center items-center">
    <div
      class="w-[400px] flex flex-col gap-2 bg-[#131B29] p-4 text-default max-w-md mx-auto rounded-lg shadow"
    >
      <h2 class="mb-2 text-lg font-semibold">Order&nbsp;Book</h2>

      <!-- 賣盤 -->
      <TableView
        :header-list="headerRow"
        :content-list="sellRows"
      />

      <!-- 最新成交價 -->
      <LastPriceBar
        :price="priceStore.last"
        :trend="priceStore.trend"
      />

      <!-- 買盤 -->
      <TableView
        :header-list="headerRow"
        :content-list="buyRows"
      />
    </div>
  </div>
</template>
