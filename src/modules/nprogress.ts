import NProgress from 'nprogress'
import type { Router } from 'vue-router'

export default (_: any, { router }: { router: Router }) => {
  router.beforeEach((to, from) => {
    if (to.path !== from.path)
      NProgress.start()
  })
  router.afterEach(() => { NProgress.done() })
}
