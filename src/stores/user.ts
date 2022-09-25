import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import type { RouteRecordRaw } from 'vue-router'
import { type User, getUserInfo, login } from '~/pages/system/user/api'
import routes from '~pages'

function hasPermission(route: RouteRecordRaw, permissions: any[] = []) {
  if (!route.meta?.permission)
    return true
  if (route.meta?.permission === true && route.children?.length)
    return filterAsyncRoutes(route.children, permissions).length

  return permissions.includes(
    Array.isArray(route.meta?.permission)
      ? route.meta.permission[0]?.permission
      : route.meta?.permission,
  )
}

function filterAsyncRoutes(routes: RouteRecordRaw[], permissions: any) {
  return routes.reduce((result: RouteRecordRaw[], route) => {
    if (hasPermission(route, permissions)) {
      result.push({
        ...route,
        children: route.children ? filterAsyncRoutes(route.children, permissions) : [],
      })
    }
    return result
  }, [])
}

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {} as User,
    routeList: [] as RouteRecordRaw[],
    removeRouteList: [] as Function[],
  }),
  getters: {
    sidebarList() {
      const getSidebarList = (routes: RouteRecordRaw[]) => routes
        .reduce((result: RouteRecordRaw[], route) => {
          if (!route.meta?.hidden) {
            result.push({
              ...route,
              path: this.router.resolve(<string>route.redirect || route).path,
              children: route.children ? getSidebarList(route.children) : [],
            })
          }
          return result
        }, [])
        .sort((a, b) => (a.meta?.order || Infinity) - (b.meta?.order || Infinity))

      const result = getSidebarList(this.routeList)
      return result
    },
    hasPermission() {
      return (val: string) => this.userInfo.permissions?.includes(val)
    },
  },
  actions: {
    async login(body: any) {
      ({ data: this.token } = await login(body))
      await this.generateRoutes()
      this.router.push(this.route.query.redirect as string || '/')
    },
    async getUserInfo() {
      const { close } = ElLoading.service({ fullscreen: true, text: '获取权限中...' })
      try {
        ({ data: this.userInfo } = await getUserInfo())
      } catch {
        // Prevents infinite interface calls when API errors are reported
        this.token = ''
      } finally {
        close()
      }
      return this.userInfo
    },
    async logout() {
      this.token = ''
      this.userInfo = {}
      if (this.route.name !== 'login')
        await this.router.push({ name: 'login', query: { redirect: this.route.query.redirect || this.route.fullPath } })

      this.removeRouteList.forEach(i => i())
    },
    async generateRoutes() {
      const { permissions } = await this.getUserInfo()
      this.removeRouteList.forEach(i => i())
      this.routeList = filterAsyncRoutes(routes, permissions)
      this.removeRouteList = this.routeList
        .filter(i => i.meta?.permission !== false)
        .map(this.router.addRoute)
    },
  },
})
