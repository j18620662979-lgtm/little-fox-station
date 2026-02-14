<script setup>
import StatsCharts from '../components/StatsCharts.vue'
import { useAppStore } from '../store/useAppStore'

const store = useAppStore()
</script>

<template>
  <div class="grid gap-4">
    <div class="card p-4">
      <div class="font-semibold">📊 打卡统计图</div>
      <div class="mt-2 text-sm text-black/70">
        这是轻量版统计：近 14 天打卡柱状 + 目标贡献占比。后续你想接更花哨的图表库也行。
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        <span class="tag">✨ 当前总打卡：{{ store.totals.totalCheckins }}</span>
        <span class="tag">📅 已点亮天数：{{ store.checkinDaysCount }}</span>
        <span class="tag">💌 已解锁信件：{{ store.unlockedLetters.length }}</span>
        <span class="tag">🎁 已解锁礼物：{{ store.unlockedGifts.length }}</span>
      </div>
    </div>

    <StatsCharts />
  </div>
</template>
