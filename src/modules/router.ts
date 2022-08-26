import type { Router } from 'vue-router'
import { useUserStore } from '~/stores/user'

export default (_: any, { router }: { router: Router }) => {
  router.beforeEach(async (to) => {
    // 获取系统设置
    const settings = useSettingsStore()
    if (!settings.list.length)
      await settings.getList()

    const user = useUserStore()
    if (!user.token) {
      // 无需登陆 即可访问的页面
      if (to.meta?.permission === false)
        return
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (!user.userInfo.permissions) {
      await user.generateRoutes()
      return to.fullPath
    }

    if (to.name === 'login')
      return '/'

    // keep-alive
    if (to.matched?.length > 2)
      to.matched.splice(1, to.matched.length - 2)
  })
}
