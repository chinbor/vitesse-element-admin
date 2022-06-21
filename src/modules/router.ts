import type { RouteLocationNormalized } from 'vue-router'
import { useRouteStore } from '~/stores/route'
import { useUserStore } from '~/stores/user'
import type { UserModule } from '~/types'

/** 打平两层以上的嵌套  */
function handleKeepAlive(to: RouteLocationNormalized) {
  if (to.matched?.length <= 2)
    return
  for (let i = 1; i < to.matched.length; i++) {
    if (!to.matched[i]?.children?.length)
      return
    to.matched[i].children.forEach((item) => {
      item.meta && (item.meta.parent = { ...to.matched[i], children: [] })
    })

    to.matched.splice(i, 1)
    handleKeepAlive(to)
  }
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

      if (!userStore.permissionList?.length) {
        await useRouteStore().generateRoutes()
        return to.fullPath
      }

      const tagsView = useTagsviewStore()
      if (router.resolve(to).fullPath !== tagsView.resolve(to).fullPath)
        tagsView.dropCachedView(to)
    })
  }
}
