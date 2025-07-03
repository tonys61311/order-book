<!-- src/components/PriceBadge.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { PriceTrend } from '@/stores/price';     // 或改成你存放 enum 的路徑
import { formatNumber } from '@/utils/number';
import IconArrowDown from '@/assets/arrow-down.svg?component';

/* ─── Props ─── */
const props = defineProps<{
  price: number;
  trend: PriceTrend;
  formatOptions?: Intl.NumberFormatOptions;
}>();

/* ─── 1. 格式化字串 ─── */
const display = computed(() =>
  formatNumber(props.price, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...props.formatOptions,
  }),
);

/* ─── 2. 文字 / 背景 / 箭頭 ─── */
const textClass = computed(() =>
  props.trend === PriceTrend.UP
    ? 'text-price-up'
    : props.trend === PriceTrend.DOWN
      ? 'text-price-down'
      : 'text-default',
);

const bgClass = computed(() =>
  props.trend === PriceTrend.UP
    ? 'bg-bar-buy'
    : props.trend === PriceTrend.DOWN
      ? 'bg-bar-sell'
      : 'bg-bar-same',
);

const showArrow = computed(() => props.trend !== PriceTrend.SAME);
const arrowDir = computed(() =>
  props.trend === PriceTrend.UP ? 'rotate-180' : 'rotate-0',
);
</script>

<template>
  <div
    class="relative flex items-center justify-center px-3 py-2 rounded-md transition-colors duration-300 ease-in-out"
    :class="bgClass"
  >
    <span :class="['relative font-semibold font-mono', textClass]">
        {{ display }}

        <!-- 箭頭 -->
        <IconArrowDown
        v-show="showArrow"
        :class="[
          'absolute left-full top-1/2 -translate-y-1/2 w-6 h-6 transition-transform',
          textClass,
          arrowDir,
        ]"
      />
    </span>
  </div>
</template>
