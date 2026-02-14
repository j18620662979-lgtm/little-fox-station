<script setup>
import { ref, inject, computed } from 'vue'
import { useAppStore } from '../store/useAppStore'
import ModalConfirm from '../components/ModalConfirm.vue'

const store = useAppStore()
const toast = inject('toast', { push: () => {} })

const confirmOpen = ref(false)
const targetId = ref(null)

const showOpen = ref(false)
const viewing = ref(null)

function askUnlock(id) { targetId.value = id; confirmOpen.value = true }
function doUnlock() {
  const res = store.unlockGift(targetId.value)
  if (!res.ok) toast.push(res.msg || '解锁失败', 'error')
  else toast.push('礼物解锁成功：我好想你雲宝。')
}
function openGift(g) {
  if (!g.unlocked) return
  viewing.value = g
  showOpen.value = true
}

const toyText = computed(() => {
  const mood = ref('')
  if (!viewing.value) return ''
  if (viewing.value.id === 'G1') return '🦊（摇尾巴）……你看，我也在为你开心。'
  if (viewing.value.id === 'G3') return '今天的心情更像：A.软软的云  B.带刺的玫瑰  C.热奶茶  D.安静的雨？（随便点一个给自己）'
  return '（这里后续可以换成图片 / 小游戏 / 彩蛋页面）'
})
</script>

<template>
  <div class="card p-4">
    <div class="font-semibold">🎁 解锁礼物</div>
    <div class="mt-2 text-sm text-black/70">礼物不能重复解锁。解锁会消耗对应打卡数。</div>

    <div class="mt-4 grid gap-3">
      <div v-for="g in store.unlocks.gifts" :key="g.id" class="card p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="font-semibold truncate">{{ g.title }}</div>
            <div class="mt-1 text-sm text-black/60">需要 {{ g.need }} 次打卡</div>
            <div class="mt-2 text-xs" :class="g.unlocked ? 'text-rose' : 'text-black/50'">
              {{ g.unlocked ? '已解锁（可查看）' : '未解锁' }}
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <button class="btn btn-primary" v-if="!g.unlocked" @click="askUnlock(g.id)">解锁</button>
            <button class="btn btn-ghost" v-else @click="openGift(g)">打开</button>
          </div>
        </div>
      </div>
    </div>

    <ModalConfirm v-model:open="confirmOpen"
      title="确认解锁礼物？"
      :message="`解锁会消耗对应打卡数。你当前总打卡：${store.totals.totalCheckins}`"
      confirmText="解锁"
      @confirm="doUnlock" />

    <teleport to="body">
      <div v-if="showOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="showOpen=false"></div>
        <div class="relative w-full sm:w-[520px] mx-3 mb-3 sm:mb-0 card p-6 fade-in">
          <div class="text-lg font-semibold">{{ viewing?.title }}</div>
<div class="mt-4 text-sm text-black/75 leading-relaxed">

  <!-- G3 小游戏 -->
  <div v-if="viewing?.id === 'G3'" class="space-y-3">
    <div>今天的心情更像哪一个？</div>

    <div class="grid grid-cols-2 gap-2">
      <button class="btn btn-ghost" @click="mood='云'">☁ 软软的云</button>
      <button class="btn btn-ghost" @click="mood='玫瑰'">🌹 带刺的玫瑰</button>
      <button class="btn btn-ghost" @click="mood='奶茶'">🧋 热奶茶</button>
      <button class="btn btn-ghost" @click="mood='雨'">🌧 安静的雨</button>
    </div>

    <div v-if="mood" class="mt-3 text-rose">
      今天的小狐狸是「{{ mood }}」状态。
    </div>
  </div>

  <!-- 其他礼物默认文字 -->
  <div v-else>
    {{ toyText }}
  </div>

</div>

          <div class="mt-5 flex justify-end">
            <button class="btn btn-primary" @click="showOpen=false">收好</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
