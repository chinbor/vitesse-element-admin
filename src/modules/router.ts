import type { Router } from 'vue-router'
import { useUserStore } from '~/stores/user'

export default (_: any, { router }: { router: Router }) => {
  router.beforeEach(async (to) => {
    // 获取系统设置
    const settings = useSettingsStore()
    if (!settings.list.length)
      await settings.getList()

    // 没有token 跳到登陆页
    const user = useUserStore()
    if (!user.token)
      return to.meta?.permission === false ? true : { name: 'login' }

    if (to.name === 'login')
      return '/'

    if (!user.userInfo.permissions) {
      await user.generateRoutes()
      return to.fullPath
    }

    const tagsView = useTagsViewStore()
    if (router.resolve(to).fullPath !== tagsView.resolve(to).fullPath)
      tagsView.dropCachedView(to)

    // keep-alive
    if (to.matched?.length > 2)
      to!.meta.matched = to.matched.splice(1, to.matched.length - 2)
  })
}
