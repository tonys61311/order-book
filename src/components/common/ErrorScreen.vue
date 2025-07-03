<script setup lang="ts">

const props = defineProps<{
  error: string
}>();

const reloadPage = () => {
  window.location.reload();
};
</script>

<template>
  <div
    v-if="error"
    class="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white text-center"
  >
    <h2 class="text-red-600 text-xl font-bold">⚠ 發生錯誤</h2>
    <p class="text-gray-700 text-base mt-2">
      {{ error || '請檢查網路連線或稍後再試' }}
    </p>
    <button
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded mt-4"
      @click="reloadPage"
    >
      重新載入
    </button>
  </div>
</template>
