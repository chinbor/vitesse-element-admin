import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.scss'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: generatedRoutes.filter(i => i.meta?.permission === false),
})
app.use(router)

Object.values(import.meta.globEager('./modules/*.ts')).forEach((i: any) => {
  app.use(i.default, { router })
})
app.mount('#app')
