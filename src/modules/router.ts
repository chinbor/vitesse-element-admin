import type { RouteLocationNormalized } from 'vue-router'
import { useRouteStore } from '~/stores/route'
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
      // @ts-expect-error ignore
      window.router = router
      /** 没有token 跳到登陆页 */
      const userStore = useUserStore()
      if (!userStore.token)
        return to.meta?.permission === false ? true : { name: 'login' }

      if (to.name === 'login')
        return '/'

      handleKeepAlive(to)

      if (!userStore.userInfo.permissions) {
        await useRouteStore().generateRoutes()
        return to.fullPath
      }

      const tagsView = useTagsviewStore()
      if (router.resolve(to).fullPath !== tagsView.resolve(to).fullPath)
        tagsView.dropCachedView(to)
    })
  }
}
