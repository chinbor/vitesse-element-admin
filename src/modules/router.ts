import type { Router } from 'vue-router'
import { useUserStore } from '~/stores/user'

export default (_: any, { router }: { router: Router }) => {
  router.beforeEach(async (to) => {
    /** 没有token 跳到登陆页 */
    const user = useUserStore()
    if (!user.token)
      return to.meta?.permission === false ? true : { name: 'login' }

    if (to.name === 'login')
      return '/'

    if (!user.userInfo.permissions) {
      await user.generateRoutes()
      return to.fullPath
    }

    const tagsView = useTagsviewStore()
    if (router.resolve(to).fullPath !== tagsView.resolve(to).fullPath)
      tagsView.dropCachedView(to)

    /** 打平两层以上的嵌套 */
    if (to.matched?.length > 2)
      to!.meta.matched = to.matched.splice(1, to.matched.length - 2)
  })
}
