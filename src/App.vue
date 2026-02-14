<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import DrawerNav from './components/DrawerNav.vue'
import TopBar from './components/TopBar.vue'
import ToastHost from './components/ToastHost.vue'

const navOpen = ref(false)
const router = useRouter()

function toggleNav() { navOpen.value = !navOpen.value }
function goHome() { router.push('/') }
</script>

<template>
  <ToastHost>
    <div class="min-h-screen bg-gradient-to-b from-blush/40 via-cream to-cream">
      <div class="max-w-[1120px] mx-auto">
        <div class="flex gap-0 lg:gap-4">
          <DrawerNav v-model:open="navOpen" />

          <main class="flex-1 p-4 lg:pl-0 pb-10">
            <TopBar :onToggleNav="toggleNav" />

            <div class="mt-4">
              <RouterView />
            </div>

            <div class="mt-8 text-center text-xs text-black/45">
              <button class="underline" @click="goHome">回到首页</button>
              <span class="mx-2">·</span>
              <span>沈执の小狐狸打卡站</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  </ToastHost>
</template>
