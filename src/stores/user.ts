import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import type { RouteRecordRaw } from 'vue-router'
import { type User, getUserInfo, login } from '~/pages/system/user/api'
import { useTagsViewStore } from '~/stores/tagsView'
import routes from '~pages'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {} as User,
    routes: [] as RouteRecordRaw[],
    sidebarList: [] as RouteRecordRaw[],
    removeRouteList: [] as Function[],
  }),
  actions: {
    async login(body: any) {
      const { data } = await login(body)
      this.token = data
      this.router.push(<string> this.route.query.redirect || '/')
    },
    async getUserInfo() {
      const { close } = ElLoading.service({ fullscreen: true, text: '获取权限中...' })
      try {
        ({ data: this.userInfo } = await getUserInfo())
      } catch {}
      close()
      return this.userInfo
    },
    async logout() {
      this.token = ''
      this.userInfo = {}
      if (this.route.name !== 'login')
        this.router.push({ path: '/login', query: { redirect: this.route.query.redirect || this.route.fullPath } })

      this.removeRouteList.forEach(i => i())
    },
    async generateRoutes() {
      const { permissions } = await useUserStore().getUserInfo()
      this.removeRouteList.forEach(i => i())
      ;([this.routes, this.sidebarList] = filterAsyncRoutes(routes, permissions))
      this.removeRouteList = this.routes
        .filter(i => i.meta?.permission !== false)
        .map(this.router.addRoute)

      /** 过滤无权限的路径 */
      const tagsView = useTagsViewStore()
      tagsView.visitedViews = tagsView.visitedViews.filter(i => this.router.hasRoute(i.name!))
      tagsView.cachedViews = []
    },
  },
})

function hasPermission(permissions: any[] = [], route: RouteRecordRaw) {
  if (!route.meta?.permission)
    return true
  if (route.meta?.permission === true && route.children?.length)
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
