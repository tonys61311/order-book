<script setup lang="ts">
import QuoteRow from './TableRow.vue'
import QuoteCell from './TableCell.vue'
import type { TableRowModel } from '@/types/tableViewModel'

const props = defineProps<{
  /** 表頭 1 列（通常只有 text） */
  headerList: TableRowModel
  /** 內容多列 */
  contentList: TableRowModel[]
}>()
</script>

<template>
  <table
    class="table-fixed w-full text-sm text-default border-separate border-spacing-y-1"
  >
    <!-- 表頭 -->
    <thead class="text-table-head">
      <tr>
        <QuoteCell
          v-for="(cell, i) in headerList.rows"
          :key="cell.value"
          :model="cell"
        />
      </tr>
    </thead>

    <!-- 內容列 -->
    <tbody>
      <QuoteRow
        v-for="(row, idx) in contentList"
        :key="row.id"
        :rowModel="row"
      />
    </tbody>
  </table>
</template>

<style scoped>

</style>
