import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from './user'
import { useTagsviewStore } from './tagsview'
import routes from '~pages'

function hasPermission(permissions: any[] = [], route: RouteRecordRaw) {
  if (!route.meta?.permission)
    return true
  if (route.children?.length)
    return filterAsyncRoutes(route.children, permissions)[0].length
  return permissions.includes(
    Array.isArray(route.meta?.permission)
      ? route.meta.permission[0]?.permission
      : route.meta?.permission,
  )
}

function filterAsyncRoutes(routes: RouteRecordRaw[], permissions: string[] = []) {
  const res: RouteRecordRaw[] = []
  const sidebarList: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    const sidebarTmp = { ...route }
    if (!hasPermission(permissions, tmp))
      return
    if (tmp.children)
      ([tmp.children, sidebarTmp.children] = filterAsyncRoutes(tmp.children, permissions))

    res.push(tmp)
    if (!tmp.meta?.hidden)
      sidebarList.push(sidebarTmp)
  })

  return [res, sidebarList.sort((a, b) => (a.meta?.order || Infinity) - (b.meta?.order || Infinity))]
}

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [] as RouteRecordRaw[],
    sidebarList: [] as RouteRecordRaw[],
    removeRouteList: [] as Function[],
  }),
  actions: {
    async generateRoutes() {
      const userStore = useUserStore()
      const permissionList = await userStore.getPermissionList()
      this.removeRouteList.forEach(i => i())
      ;([this.routes, this.sidebarList] = filterAsyncRoutes(routes, permissionList))
      this.removeRouteList = this.routes
        .filter(i => i.meta?.permission !== false)
        .map(this.router.addRoute)

      /** 过滤无权限的路径 */
      const tagsView = useTagsviewStore()
      tagsView.visitedViews = tagsView.visitedViews.filter(i => this.router.hasRoute(i.name!))
      tagsView.cachedViews = []
    },
  },

})
