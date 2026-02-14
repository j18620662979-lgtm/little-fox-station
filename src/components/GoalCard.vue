<script setup>
import { computed, ref, inject } from 'vue'
import { useAppStore } from '../store/useAppStore'
import ModalConfirm from './ModalConfirm.vue'

const props = defineProps({
  goal: Object,
  checked: Boolean
})
const emit = defineEmits(['toggle'])

const store = useAppStore()
const toast = inject('toast', { push: () => {} })

const confirmDeleteOpen = ref(false)
const confirmArchiveOpen = ref(false)
const editing = ref(false)
const draft = ref('')

const isArchived = computed(() => !!props.goal?.archived)

function toggle() {
  if (isArchived.value) return
  emit('toggle', props.goal.id)
}

function startEdit() {
  editing.value = true
  draft.value = props.goal.title
}

function saveEdit() {
  const res = store.editGoal(props.goal.id, draft.value)
  if (!res.ok) toast.push(res.msg || '修改失败', 'error')
  else toast.push('修改成功')
  editing.value = false
}

function archive() {
  store.archiveGoal(props.goal.id)
  toast.push('已归档')
}

function del() {
  store.deleteGoal(props.goal.id)
  toast.push('已删除')
}
</script>

<template>
  <div class="card p-4">
    <div class="flex items-start gap-3">
      <button class="mt-1 w-6 h-6 rounded-md border border-black/10 flex items-center justify-center"
        :class="checked ? 'bg-rose text-white border-transparent' : 'bg-white/80'"
        @click="toggle">
        <span v-if="checked">✓</span>
      </button>

      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <div class="font-semibold truncate" :class="isArchived ? 'text-black/40 line-through' : ''">
            📌 {{ goal.title }}
          </div>
          <div class="text-xs text-black/60">⏱ {{ goal.count }} 次</div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <button class="btn btn-ghost" @click="startEdit" :disabled="isArchived">🔄 修改</button>
          <button class="btn btn-ghost" @click="confirmArchiveOpen=true" :disabled="isArchived">📦 归档</button>
          <button class="btn btn-ghost" @click="confirmDeleteOpen=true">🗑 删除</button>
        </div>

        <div v-if="editing" class="mt-3">
          <input v-model="draft" class="w-full rounded-xl border border-black/10 px-3 py-2 bg-white/80" placeholder="修改目标标题（仅限一次）" />
          <div class="mt-2 flex justify-end gap-2">
            <button class="btn btn-ghost" @click="editing=false">取消</button>
            <button class="btn btn-primary" @click="saveEdit">保存</button>
          </div>
        </div>
      </div>
    </div>

    <ModalConfirm v-model:open="confirmArchiveOpen"
      title="归档这个目标？"
      message="归档后它会从首页隐藏，进入“历史目标归档”。（还能查看累计次数）"
      confirmText="归档"
      @confirm="archive" />

    <ModalConfirm v-model:open="confirmDeleteOpen"
      title="删除这个目标？"
      message="删除需要二次确认。删除后历史记录会自动清理引用。"
      confirmText="删除"
      :danger="true"
      @confirm="del" />
  </div>
</template>
