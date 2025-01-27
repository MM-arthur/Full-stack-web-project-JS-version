import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Management.vue'

const routes = [
  {
    path: '/Management',
    name: 'Management',
    component: Home
  },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
})

export default router
