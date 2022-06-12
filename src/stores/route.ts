import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from './user'
import { useTagsviewStore } from './tagsview'
import routes from '~pages'

function hasPermission(permissions: any[] = [], route: RouteRecordRaw) {
  if (!route.meta?.permission)
    return true

  // if (route.meta?.permission.startsWith('white'))
  // return permissions.some(permission => route.meta?.permission === (`white${permission}`))

  if (route.children)
    return filterAsyncRoutes(route.children, permissions).length
  else
    return permissions.includes(route.meta?.permission)
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

  // @ts-expect-error ignore
  return [res, sidebarList.sort((a, b) => a.meta?.order - b.meta?.order)]
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
      // 删除所有添加的动态路由 防止出现白屏: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0029-router-dynamic-routing.md
      this.removeRouteList.forEach(i => i())
      ;([this.routes, this.sidebarList] = filterAsyncRoutes(routes, permissionList))
      this.removeRouteList = this.routes
        .filter(i => i.meta?.permission !== false)
        .map(route => this.router.addRoute(
          route.meta?.layout ? setupLayouts([route])[0] : route,
        ))

      /** 过滤无权限的路径 */
      const tagsView = useTagsviewStore()
      tagsView.visitedViews = tagsView.visitedViews.filter(i => this.router.hasRoute(i.name!))
      tagsView.cachedViews = []
    },
  },

})
