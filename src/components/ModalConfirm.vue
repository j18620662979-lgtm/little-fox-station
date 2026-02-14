<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '确认一下' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  danger: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel', 'update:open'])

const show = computed(() => props.open)

function close() {
  emit('update:open', false)
  emit('cancel')
}

function confirm() {
  emit('confirm')
  emit('update:open', false)
}

function onKey(e) {
  if (!show.value) return
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="close"></div>
      <div class="relative w-full sm:w-[420px] mx-3 mb-3 sm:mb-0 card p-5 fade-in">
        <div class="text-base font-semibold">{{ title }}</div>
        <div v-if="message" class="mt-2 text-sm text-black/70 leading-relaxed">{{ message }}</div>
        <div class="mt-4 flex justify-end gap-2">
          <button class="btn btn-ghost" @click="close">{{ cancelText }}</button>
          <button class="btn" :class="danger ? 'bg-black text-white' : 'btn-primary'" @click="confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </teleport>
</template>
