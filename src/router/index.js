import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LettersView from '../views/LettersView.vue'
import GiftsView from '../views/GiftsView.vue'
import AchievementsView from '../views/AchievementsView.vue'
import ArchiveView from '../views/ArchiveView.vue'
import StatsView from '../views/StatsView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/letters', name: 'letters', component: LettersView },
  { path: '/gifts', name: 'gifts', component: GiftsView },
  { path: '/achievements', name: 'achievements', component: AchievementsView },
  { path: '/archive', name: 'archive', component: ArchiveView },
  { path: '/stats', name: 'stats', component: StatsView },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})
