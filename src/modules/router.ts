import type { RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '~/stores/user'
import type { UserModule } from '~/types'

/** 打平两层以上的嵌套 */
function handleKeepAlive(to: RouteLocationNormalized) {
  if (to.matched?.length < 3)
    return
  if (to.matched.at(-1)?.meta)
    to.matched.at(-1)!.meta.parent = { ...to.matched.at(-2)!, children: [] }
  to.matched.splice(1, to.matched.length - 2)
}

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(async (to) => {
      /** 没有token 跳到登陆页 */
      const user = useUserStore()
      if (!user.token)
        return to.meta?.permission === false ? true : { name: 'login' }

      if (to.name === 'login')
        return '/'

      handleKeepAlive(to)
      if (!user.userInfo.permissions) {
        await user.generateRoutes()
        return to.fullPath
      }

      const tagsView = useTagsviewStore()
      if (router.resolve(to).fullPath !== tagsView.resolve(to).fullPath)
        tagsView.dropCachedView(to)
    })
  }
}
