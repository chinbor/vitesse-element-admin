import type { Router } from 'vue-router'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export default (_: any, { router }: { router: Router }) => {
  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  })
}
