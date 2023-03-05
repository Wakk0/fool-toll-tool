import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/manifest-tool',
      name: 'Manifest-Tool',
      component: () => import('../views/ManifestView.vue')
    }
  ]
})

export default router
