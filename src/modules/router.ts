import { useRouteStore } from '~/stores/route'
import { useUserStore } from '~/stores/user'
import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(async (to) => {
      // @ts-expect-error ignore
      window.router = router
      /** 没有token 跳到登陆页 */
      const userStore = useUserStore()
      if (!userStore.token)
        return to.name === 'login' ? true : { name: 'login' }
      if (to.name === 'login')
        return '/'

      if (!userStore.permissionList?.length) {
        await useRouteStore().generateRoutes()
        return to.fullPath
      }
    })
  }
}
