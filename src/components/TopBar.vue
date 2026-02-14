<script setup>
import { computed } from 'vue'
import { useAppStore } from '../store/useAppStore'
import dayjs from 'dayjs'

const props = defineProps({ onToggleNav: Function })
const store = useAppStore()

const title = computed(() => store.meta.title)
const pledge = computed(() => store.meta.pledge)

const total = computed(() => store.totals.totalCheckins)
const missYou = computed(() => store.totals.missYouCount)
const progress = computed(() => store.totals.highLatitudeProgress)

const today = computed(() => dayjs().format('YYYY/MM/DD'))
</script>

<template>
  <div class="card p-4 sm:p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <button class="lg:hidden btn btn-ghost px-3 py-2" @click="props.onToggleNav?.()">☰</button>
          <div class="text-lg sm:text-xl font-semibold truncate">{{ title }}</div>
        </div>
        <div class="mt-2 text-sm text-black/70 leading-relaxed">
          “{{ pledge }}”
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="tag">📅 {{ today }}</span>
          <span class="tag">✨ 总打卡：{{ total }}</span>
          <span class="tag">🫶 想你：{{ missYou }}</span>
          <span class="tag">🧭 高纬度追踪：{{ progress }}</span>
        </div>
      </div>

      <div class="flex flex-col items-end gap-2 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-11 h-11 rounded-full bg-blush flex items-center justify-center text-xl shadow-soft border border-black/5">
            🦊
          </div>
          <button class="btn btn-ghost px-3 py-2" @click="store.toggleMusic()">
            {{ store.meta.musicOn ? '⏸️' : '🎵' }}
          </button>
        </div>
        <div class="text-xs text-black/60">（音乐按钮：先占位，后续可接入曲目）</div>
      </div>
    </div>
  </div>
</template>
