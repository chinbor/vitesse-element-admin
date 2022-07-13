import { createPinia } from 'pinia'
import type { App } from 'vue'
import type { Router } from 'vue-router'

// Setup Pinia
// https://pinia.esm.dev/
export default (app: App, { router }: { router: Router }) => {
  const pinia = createPinia()
  pinia.use(({ store }) => {
    store.router = router
    store.route = router.currentRoute as any
  })
  app.use(pinia)
}
