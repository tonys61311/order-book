<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/utils/number'
import type { TableCellModel } from '@/types/tableViewModel'

const props = defineProps<{ model: TableCellModel }>()

const display = computed(() => formatNumber(props.model.value, props.model.formatOptions))

/* --------- 動畫 --------- */
const flash = computed(() => {
  if (!props.model.delta) return ''
  return props.model.delta > 0
    ? 'animate-flash bg-flash-up'
    : 'animate-flash bg-flash-down'
})
</script>

<template>
  <td
    :class="[
      props.model.textClass ?? '',
      'text-right font-mono',
      flash,
      'relative',
    ]"
  >
    {{ display }}

    <!-- 背景長條 (Total 欄使用) -->
    <div
      v-if="props.model.barPercent && props.model.barColor"
      class="absolute inset-y-0 right-0"
      :class="props.model.barColor"
      :style="{ width: props.model.barPercent }"
    />
  </td>
</template>
