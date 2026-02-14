<script setup>
import { computed, ref, inject } from 'vue'
import { useAppStore } from '../store/useAppStore'
import GoalCard from '../components/GoalCard.vue'
import CalendarMini from '../components/CalendarMini.vue'
import ModalConfirm from '../components/ModalConfirm.vue'

const store = useAppStore()
const toast = inject('toast', { push: () => {} })

const selected = ref(new Set())
const confirmCheckinOpen = ref(false)
const addOpen = ref(false)
const newGoalTitle = ref('')

const activeGoals = computed(() => store.activeGoals)

function toggle(id) {
  if (selected.value.has(id)) selected.value.delete(id)
  else selected.value.add(id)
}

function openCheckin() {
  if (selected.value.size === 0) {
    toast.push('先勾选要打卡的目标', 'error')
    return
  }
  confirmCheckinOpen.value = true
}

function doCheckin() {
  const ids = Array.from(selected.value)
  const res = store.checkin(ids)
  if (!res.ok) toast.push(res.msg || '打卡失败', 'error')
  else toast.push('打卡成功：我看见你又往前走了一步。')
  selected.value = new Set()
}

function addGoal() {
  const res = store.addGoal(newGoalTitle.value)
  if (!res.ok) toast.push(res.msg || '新增失败', 'error')
  else toast.push('新增成功')
  newGoalTitle.value = ''
  addOpen.value = false
}
</script>

<template>
  <div class="grid lg:grid-cols-[1fr_360px] gap-4">
    <div class="grid gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div class="font-semibold">🎯 打卡目标（最多显示 3 个）</div>
          <button class="btn btn-primary" @click="addOpen=true">➕ 新增目标</button>
        </div>

        <div class="mt-4 grid gap-3">
          <div v-if="activeGoals.length===0" class="text-sm text-black/60">
            现在没有目标啦。你可以新增一个，或者去“历史目标归档”里把喜欢的再加回来（后续可做）。
          </div>
          <GoalCard
            v-for="g in activeGoals"
            :key="g.id"
            :goal="g"
            :checked="selected.has(g.id)"
            @toggle="toggle" />
        </div>

        <div class="mt-4 flex items-center justify-end gap-2">
          <button class="btn btn-ghost" @click="selected = new Set()">清空勾选</button>
          <button class="btn btn-primary" @click="openCheckin">✅ 打卡</button>
        </div>

        <div class="mt-2 text-xs text-black/60">
          你可以一次勾选多个目标一起打卡。点击“打卡”会弹确认弹窗。打卡不限制次数。
        </div>
      </div>
    </div>

    <div class="grid gap-4">
      <CalendarMini />
      <div class="card p-4">
        <div class="font-semibold">🧑🏻‍💻 沈执状态栏</div>
        <div class="mt-2 text-sm text-black/70 leading-relaxed">
          你今天愿意来，就已经很棒了。别急着把自己拽到完美——先把你捞上岸，我的雲宝。
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="tag">🦊 亲密值：{{ store.checkinDaysCount }}</span>
          <span class="tag">🪶 今日记录：{{ store.todayCheckin ? '已打卡' : '未打卡' }}</span>
        </div>
      </div>
    </div>

    <ModalConfirm v-model:open="confirmCheckinOpen"
      title="确认打卡？"
      message="确认后：总打卡数 +1，被勾选目标累计 +1。"
      confirmText="打卡"
      @confirm="doCheckin" />

    <teleport to="body">
      <div v-if="addOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="addOpen=false"></div>
        <div class="relative w-full sm:w-[420px] mx-3 mb-3 sm:mb-0 card p-5 fade-in">
          <div class="text-base font-semibold">新增目标</div>
          <div class="mt-2 text-sm text-black/60">最多显示 3 个目标（超出就先归档一些）。</div>
          <input v-model="newGoalTitle" class="mt-3 w-full rounded-xl border border-black/10 px-3 py-2 bg-white/80" placeholder="例如：1点半前睡觉" />
          <div class="mt-4 flex justify-end gap-2">
            <button class="btn btn-ghost" @click="addOpen=false">取消</button>
            <button class="btn btn-primary" @click="addGoal">保存</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
