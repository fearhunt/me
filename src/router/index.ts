import type { RouteRecordRaw } from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Work from '@/pages/Work.vue'
import WorkDetail from '@/pages/WorkDetail.vue'
import Writing from '@/pages/Writing.vue'
import NotFound from '@/pages/NotFound.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/work', name: 'work', component: Work },
  { path: '/work/:slug', name: 'work-detail', component: WorkDetail },
  { path: '/writing', name: 'writing', component: Writing },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]
