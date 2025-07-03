import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import OrderBookPanel from '@/views/OrderBookPanel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: OrderBookPanel,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
