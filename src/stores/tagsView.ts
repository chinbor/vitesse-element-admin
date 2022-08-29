import { defineStore } from 'pinia'
import type { RouteLocation, RouteLocationRaw } from 'vue-router'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    cachedViews: [] as any[],
    visitedViews: JSON.parse(localStorage.getItem('visitedViews') || '[]') as RouteLocation[],
  }),
  getters: {
    resolve(state) {
      return (view: RouteLocationRaw) => {
        try {
          const route = this.router.resolve(view)
          return state.visitedViews.find(i => i.path === route.path) || route
        } catch (e: any) {
          // 如果解析了无权限的路由报错，跳转到403页面。
          return this.router.resolve({
            ...e.location,
            name: 'all',
            params: { all: e.location.path.split('/').filter(Boolean) },
          })
        }
      }
    },
  },
  actions: {
    addView(view: RouteLocationRaw) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    addVisitedView(view: RouteLocationRaw) {
      const route = this.router.resolve(view)
      if (route.meta.permission === false || !route.meta.title)
        return

      const index = this.visitedViews.findIndex(v => v.path === route.path)
      if (index < 0)
        this.visitedViews.push(route)
      else
        this.visitedViews[index] = route
    },
    addCachedView(view: RouteLocationRaw) {
      const route = this.router.resolve(view)
      if (route.meta.permission === false || !route.meta.title)
        return

      if (route?.name && !this.cachedViews.includes(route.name!))
        this.cachedViews.push(route?.name)
    },
    dropView(view?: RouteLocationRaw) {
      view = view || this.route
      this.dropVisitedView(view)
      this.dropCachedView(view)
    },
    dropVisitedView(view: RouteLocationRaw) {
      const index = this.visitedViews.findIndex(v => v.path === this.router.resolve(view).path)
      if (index >= 0)
        this.visitedViews.splice(index, 1)
    },
    dropCachedView(view: RouteLocationRaw) {
      const index = this.cachedViews.indexOf(this.router.resolve(view).name)
      if (index >= 0)
        this.cachedViews.splice(index, 1)
    },
    delOthersViews(view?: RouteLocationRaw) {
      const route = this.router.resolve(view || '')
      this.visitedViews = this.visitedViews.filter(v => v.path === route?.path)
      this.cachedViews = this.cachedViews.filter(v => v !== route?.name)
    },
    async push(view: RouteLocationRaw) {
      const route = this.resolve(view)
      if (route.path === this.route.path)
        return this.router.push('/redirect')

      this.router.push(route)
    },
    back(route?: RouteLocationRaw) {
      this.dropView(this.route)
      if (route)
        return this.push(route)

      this.router.back()
    },
  },
})
