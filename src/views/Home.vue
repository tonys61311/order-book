<template>
  <div class="flex flex-col h-full justify-center items-center">
    <div class="bg-[#131B29] text-[#F0F4F8] w-64 p-4 text-sm">
      <h2 class="text-[#8698aa] mb-2">Order Book</h2>

      <!-- Sell Quotes -->
      <div v-for="(quote, index) in sellQuotes" :key="'sell' + index"
        class="flex justify-between items-center py-1 px-2 hover:bg-[#1E3059]">
        <div class="text-[#FF5B5A] w-20 text-right">{{ formatNumber(quote.price) }}</div>
        <div class="w-14 text-right">{{ formatNumber(quote.size) }}</div>
        <div class="w-14 text-right">{{ formatNumber(quote.total) }}</div>
      </div>

      <!-- Last Price -->
      <div class="my-2 text-center font-bold py-1 rounded"
        :style="{ color: lastPriceColor.text, backgroundColor: lastPriceColor.bg }">
        {{ formatNumber(lastPrice) }}
        <span v-if="priceDirection === 'up'">▲</span>
        <span v-else-if="priceDirection === 'down'">▼</span>
      </div>

      <!-- Buy Quotes -->
      <div v-for="(quote, index) in buyQuotes" :key="'buy' + index"
        class="flex justify-between items-center py-1 px-2 hover:bg-[#1E3059]">
        <div class="text-[#00b15d] w-20 text-right">{{ formatNumber(quote.price) }}</div>
        <div class="w-14 text-right">{{ formatNumber(quote.size) }}</div>
        <div class="w-14 text-right">{{ formatNumber(quote.total) }}</div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

function formatNumber(value: number | string): string {
  const num = Number(value)
  return isNaN(num) ? String(value) : num.toLocaleString('en-US')
}

// 假資料
const sellQuotes = ref([
  { price: 21699, size: 3691, total: 5657 },
  { price: 21693.5, size: 461, total: 1966 },
])

const buyQuotes = ref([
  { price: 21664.5, size: 591, total: 591 },
  { price: 21662, size: 118, total: 709 },
])

const lastPrice = ref(21657.5)
const prevPrice = ref(21655)

// 判斷價格顏色
const priceDirection = computed(() => {
  if (lastPrice.value > prevPrice.value) return 'up'
  if (lastPrice.value < prevPrice.value) return 'down'
  return 'same'
})

const lastPriceColor = computed(() => {
  if (priceDirection.value === 'up') {
    return { text: '#00b15d', bg: 'rgba(16, 186, 104, 0.12)' }
  } else if (priceDirection.value === 'down') {
    return { text: '#FF5B5A', bg: 'rgba(255, 90, 90, 0.12)' }
  } else {
    return { text: '#F0F4F8', bg: 'rgba(134, 152, 170, 0.12)' }
  }
})
</script>
