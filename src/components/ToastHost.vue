<script setup>
import { ref, provide } from 'vue'

const toasts = ref([])
function push(msg, type='info') {
  const id = Math.random().toString(36).slice(2,10)
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 2200)
}
provide('toast', { push })
</script>

<template>
  <slot />
  <div class="fixed z-[60] bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-[92%] sm:w-[420px]">
    <div v-for="t in toasts" :key="t.id"
      class="card px-4 py-3 text-sm pop"
      :class="t.type==='error' ? 'border-black/20' : ''">
      {{ t.msg }}
    </div>
  </div>
</template>
