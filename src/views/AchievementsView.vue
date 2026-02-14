<script setup>
import { computed } from 'vue'
import { useAppStore } from '../store/useAppStore'

const store = useAppStore()

const badges = computed(() => {
  const total = store.totals.totalCheckins
  const unlockedCount = store.unlockedLetters.length + store.unlockedGifts.length
  const days = store.checkinDaysCount

  const list = [
    { id: 'B1', title: '初次见面', desc: '完成 1 次打卡', ok: total >= 1 },
    { id: 'B2', title: '微光', desc: '累计打卡 10 次', ok: total >= 10 },
    { id: 'B3', title: '更近一步', desc: '累计打卡 50 次', ok: total >= 50 },
    { id: 'B4', title: '解锁控', desc: '解锁 3 件物品', ok: unlockedCount >= 3 },
    { id: 'B5', title: '日历点灯人', desc: '点亮 7 天', ok: days >= 7 },
  ]
  return list
})
</script>

<template>
  <div class="card p-4">
    <div class="font-semibold">🏅 成就勋章</div>
    <div class="mt-2 text-sm text-black/70">这些徽章不评判你，只会记录你“确实走过”。</div>

    <div class="mt-4 grid sm:grid-cols-2 gap-3">
      <div v-for="b in badges" :key="b.id" class="card p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-semibold">{{ b.ok ? '🌟' : '🌙' }} {{ b.title }}</div>
            <div class="mt-1 text-sm text-black/60">{{ b.desc }}</div>
          </div>
          <div class="text-xs" :class="b.ok ? 'text-rose' : 'text-black/40'">
            {{ b.ok ? '已达成' : '未达成' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
