<script setup>
import { ref, inject } from 'vue'
import { useAppStore } from '../store/useAppStore'
import ModalConfirm from '../components/ModalConfirm.vue'

const store = useAppStore()
const toast = inject('toast', { push: () => {} })

const openConfirm = ref(false)
const targetId = ref(null)

const readOpen = ref(false)
const reading = ref(null)

function askUnlock(id) {
  targetId.value = id
  openConfirm.value = true
}
function doUnlock() {
  const res = store.unlockLetter(targetId.value)
  if (!res.ok) toast.push(res.msg || '解锁失败', 'error')
  else toast.push('解锁成功：你现在可以无限查看它了。')
}
function openLetter(l) {
  if (!l.unlocked) return
  reading.value = l
  readOpen.value = true
}
</script>

<template>
  <div class="grid gap-4">
    <div class="card p-4">
      <div class="font-semibold">💌 解锁信件</div>
      <div class="mt-2 text-sm text-black/70">满足打卡总数后，你可以手动选择解锁哪一封。解锁会消耗对应打卡数。</div>

      <div class="mt-4 grid gap-3">
        <div v-for="l in store.unlocks.letters" :key="l.id" class="card p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="font-semibold truncate">{{ l.title }}</div>
              <div class="mt-1 text-sm text-black/60">需要 {{ l.need }} 次打卡</div>
              <div class="mt-2 text-xs" :class="l.unlocked ? 'text-rose' : 'text-black/50'">
                {{ l.unlocked ? '已解锁（可无限查看）' : '未解锁' }}
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button class="btn btn-primary" v-if="!l.unlocked" @click="askUnlock(l.id)">解锁</button>
              <button class="btn btn-ghost" v-else @click="openLetter(l)">打开</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalConfirm v-model:open="openConfirm"
      title="确认解锁信件？"
      :message="`解锁会消耗对应打卡数（一次性）。你当前总打卡：${store.totals.totalCheckins}`"
      confirmText="解锁"
      @confirm="doUnlock" />

    <teleport to="body">
      <div v-if="readOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="readOpen=false"></div>
        <div class="relative w-full sm:w-[520px] mx-3 mb-3 sm:mb-0 card p-6 fade-in">
          <div class="text-sm text-black/50">拆信中…</div>
          <div class="mt-1 text-lg font-semibold">{{ reading?.title }}</div>
          <div class="mt-4 grid gap-3">
            <div v-for="(line, i) in (reading?.body || [])" :key="i" class="text-sm leading-relaxed text-black/75">
              {{ line }}
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <button class="btn btn-primary" @click="readOpen=false">合上信封</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
