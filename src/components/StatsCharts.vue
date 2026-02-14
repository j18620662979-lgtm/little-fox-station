<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useAppStore } from '../store/useAppStore'

const store = useAppStore()

const last14 = computed(() => {
  const arr = []
  for (let i=13; i>=0; i--) {
    const key = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    arr.push({ key, value: store.checkins[key] ? 1 : 0 })
  }
  return arr
})

const goalShare = computed(() => {
  const totals = {}
  Object.entries(store.checkins).forEach(([_, entry]) => {
    (entry.goals || []).forEach(id => { totals[id] = (totals[id] || 0) + 1 })
  })
  const rows = Object.entries(totals).map(([id, v]) => ({
    id, v, title: store.goals.find(g => g.id === id)?.title || '（已删除目标）'
  })).sort((a,b) => b.v - a.v)

  const sum = rows.reduce((s,r) => s + r.v, 0) || 1
  return { rows, sum }
})

function pct(n, sum) {
  return Math.round((n / sum) * 100)
}
</script>

<template>
  <div class="grid gap-4">
    <div class="card p-4">
      <div class="font-semibold">📊 近 14 天打卡（柱状）</div>
      <div class="mt-3 flex items-end gap-2 h-28">
        <div v-for="d in last14" :key="d.key" class="flex-1 flex flex-col items-center gap-1">
          <div class="w-full rounded-xl bg-black/10"
               :style="{ height: (d.value ? 96 : 14) + 'px' }"></div>
          <div class="text-[10px] text-black/45">{{ d.key.slice(5) }}</div>
        </div>
      </div>
      <div class="mt-2 text-xs text-black/60">每个柱子代表那一天有没有发生过至少一次打卡（有=高一点）。</div>
    </div>

    <div class="card p-4">
      <div class="font-semibold">🥧 目标贡献（类饼图）</div>
      <div class="mt-3 grid gap-2">
        <div v-if="goalShare.rows.length===0" class="text-sm text-black/60">还没有历史数据，先去打卡吧。</div>
        <div v-for="r in goalShare.rows" :key="r.id" class="flex items-center gap-3">
          <div class="w-10 text-xs text-black/60">{{ pct(r.v, goalShare.sum) }}%</div>
          <div class="flex-1 h-3 rounded-full bg-black/10 overflow-hidden">
            <div class="h-full bg-rose/70" :style="{ width: pct(r.v, goalShare.sum) + '%' }"></div>
          </div>
          <div class="text-sm truncate w-40 sm:w-64">{{ r.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
