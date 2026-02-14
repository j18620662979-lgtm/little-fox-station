<script setup>
import { computed, inject, ref } from 'vue'
import { useAppStore } from '../store/useAppStore'
import ModalConfirm from '../components/ModalConfirm.vue'

const store = useAppStore()
const toast = inject('toast', { push: () => {} })

const confirmResetOpen = ref(false)

const archived = computed(() => store.archivedGoals)

function restoreTip() {
  toast.push('（后续可加“从归档恢复到首页”功能）')
}
</script>

<template>
  <div class="grid gap-4">
    <div class="card p-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="font-semibold">📜 历史目标归档</div>
          <div class="mt-1 text-sm text-black/60">完成后变灰、进入归档状态的目标会在这里。</div>
        </div>
        <button class="btn btn-ghost" @click="confirmResetOpen=true">重置全部数据</button>
      </div>

      <div class="mt-4 grid gap-3">
        <div v-if="archived.length===0" class="text-sm text-black/60">暂无归档目标。</div>

        <div v-for="g in archived" :key="g.id" class="card p-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="font-semibold truncate text-black/50 line-through">📌 {{ g.title }}</div>
              <div class="mt-1 text-sm text-black/60">累计：{{ g.count }} 次</div>
            </div>
            <button class="btn btn-ghost" @click="restoreTip">🔁 恢复（占位）</button>
          </div>
        </div>
      </div>
    </div>

    <ModalConfirm v-model:open="confirmResetOpen"
      title="重置全部数据？"
      message="会清空目标、打卡记录、解锁状态。这个操作不可撤销。"
      confirmText="重置"
      :danger="true"
      @confirm="store.resetAll()" />
  </div>
</template>
