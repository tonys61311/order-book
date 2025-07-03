import { createRouter, createWebHistory } from 'vue-router'
import OrderBookPanel from '@/views/OrderBookPanel.vue'

const routes = [
  {
    path: '/',
    name: 'OrderBookPanel',
    component: OrderBookPanel,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
