<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  spinnerColor: {
    type: String,
    default: '#3498db'
  },
  spinnerSize: {
    type: Number,
    default: 40
  },
  textColor: {
    type: String,
    default: 'white'
  }
});
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
  >
    <div class="flex flex-col items-center">
      <div
        class="border-4 border-gray-300 border-t-transparent rounded-full animate-spin"
        :style="{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          borderTopColor: spinnerColor
        }"
      ></div>
      <p class="mt-2 font-bold" :style="{ color: textColor }">Loading...</p>
    </div>
  </div>
</template>
