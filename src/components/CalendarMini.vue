<script setup>
import { computed, ref, inject } from 'vue'
import dayjs from 'dayjs'
import { useAppStore } from '../store/useAppStore'

const store = useAppStore()
const toast = inject('toast', { push: () => {} })

const cursor = ref(dayjs())

const startOfMonth = computed(() => cursor.value.startOf('month'))
const endOfMonth = computed(() => cursor.value.endOf('month'))
const monthTitle = computed(() => cursor.value.format('YYYY 年 M 月'))

const days = computed(() => {
  const startWeekday = startOfMonth.value.day() // 0-6 (Sun-Sat)
  const totalDays = endOfMonth.value.date()

  const slots = []
  // padding
  for (let i=0; i<startWeekday; i++) slots.push(null)
  for (let d=1; d<=totalDays; d++) {
    const date = cursor.value.date(d)
    slots.push(date)
  }
  // make rows complete
  while (slots.length % 7 !== 0) slots.push(null)
  return slots
})

function prev() { cursor.value = cursor.value.subtract(1, 'month') }
function next() { cursor.value = cursor.value.add(1, 'month') }

function openDay(date) {
  if (!date) return
  const key = date.format('YYYY-MM-DD')
  const entry = store.checkins[key]
  if (!entry) {
    toast.push(`${key}：这天还没打卡`)
    return
  }
  const titles = (entry.goals || [])
    .map(id => store.goals.find(g => g.id === id)?.title)
    .filter(Boolean)
  toast.push(`${key}：完成 ${titles.length} 项：${titles.join('、')}`)
}

function hasCheckin(date) {
  if (!date) return false
  const key = date.format('YYYY-MM-DD')
  return !!store.checkins[key]
}
</script>

<template>
  <div class="card p-4">
    <div class="flex items-center justify-between">
      <div class="font-semibold">📅 日历</div>
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost px-3 py-1" @click="prev">‹</button>
        <div class="text-sm">{{ monthTitle }}</div>
        <button class="btn btn-ghost px-3 py-1" @click="next">›</button>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-7 text-xs text-black/50">
      <div class="py-1 text-center" v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</div>
    </div>

    <div class="mt-2 grid grid-cols-7 gap-2">
      <button v-for="(d, idx) in days" :key="idx"
        class="h-9 rounded-xl border border-black/5 flex items-center justify-center text-sm transition"
        :class="[
          d ? 'bg-white/70 hover:bg-white' : 'bg-transparent border-transparent cursor-default',
          hasCheckin(d) ? 'ring-2 ring-rose/60' : ''
        ]"
        @click="openDay(d)">
        <span v-if="d">{{ d.date() }}</span>
      </button>
    </div>

    <div class="mt-3 text-xs text-black/60">
      打卡过的日期会有一圈淡粉色标记，点一下会告诉你那天完成了哪些目标。
    </div>
  </div>
</template>
