<script setup lang="ts">
import TableCell from './TableCell.vue'
import type { TableRowModel } from '@/types/tableViewModel'

const props = defineProps<{ rowModel: TableRowModel }>()

</script>

<template>
  <tr
    :class="[
      'align-middle cursor-default hover:bg-row-hover transition-colors',
      rowModel.isNew ? `animate-flash ${rowModel.highlightColor}` : '',
    ]"
  >
    <TableCell
      v-for="(cell, i) in rowModel.rows"
      :key="i"
      :model="cell"
    />
  </tr>
</template>
