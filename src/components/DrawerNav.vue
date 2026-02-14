<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../store/useAppStore'


const store = useAppStore()
const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])

const route = useRoute()
const router = useRouter()

const items = [
  { to: '/', icon: '🏠', label: '首页' },
  { to: '/letters', icon: '💌', label: '解锁信件' },
  { to: '/gifts', icon: '🎁', label: '解锁礼物' },
  { to: '/achievements', icon: '🏅', label: '成就勋章' },
  { to: '/archive', icon: '📜', label: '历史目标归档' },
  { to: '/stats', icon: '📊', label: '打卡统计图' },
]

const isOpen = computed(() => props.open)

function exportData() {
  const dataStr = JSON.stringify(store.$state)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'fox-checkin-backup.json'
  a.click()

  URL.revokeObjectURL(url)

  store.lastSyncAt = new Date().toISOString()
}

function importData(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const parsed = JSON.parse(e.target.result)
    store.$patch(parsed)
    store.lastSyncAt = new Date().toISOString()
  }
  reader.readAsText(file)
}

function go(to) {
  router.push(to)
  emit('update:open', false)
}
</script>

<template>
  <div class="hidden lg:block w-[260px] sticky top-0 h-screen p-4">
    <div class="card p-4">
      <div class="text-sm font-semibold mb-2">菜单</div>
      <div class="flex flex-col gap-1">
        <button v-for="it in items" :key="it.to"
          class="text-left px-3 py-2 rounded-xl hover:bg-black/5 transition"
          :class="route.path===it.to ? 'bg-black/5' : ''"
          @click="go(it.to)">
          <span class="mr-2">{{ it.icon }}</span>{{ it.label }}
        </button>
      </div>
      <div class="border-t mt-3 pt-3 flex flex-col gap-1">
  <button
    @click="exportData"
    class="text-left px-3 py-2 rounded-xl hover:bg-black/5 transition">
    📤 导出数据
  </button>

  <label
    class="text-left px-3 py-2 rounded-xl hover:bg-black/5 transition cursor-pointer">
    📥 导入数据
    <input type="file" accept=".json" @change="importData" class="hidden" />
  </label>
</div>
    </div>
  </div>

  <teleport to="body">
    <div v-if="isOpen" class="lg:hidden fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black/30" @click="$emit('update:open', false)"></div>
      <div class="absolute left-3 top-3 bottom-3 w-[280px] card p-4 fade-in">
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold">菜单</div>
          <button class="btn btn-ghost" @click="$emit('update:open', false)">关闭</button>
        </div>
        <div class="mt-3 flex flex-col gap-1">
          <button v-for="it in items" :key="it.to"
            class="text-left px-3 py-2 rounded-xl hover:bg-black/5 transition"
            :class="route.path===it.to ? 'bg-black/5' : ''"
            @click="go(it.to)">
            <span class="mr-2">{{ it.icon }}</span>{{ it.label }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
