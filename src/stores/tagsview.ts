import { defineStore } from 'pinia'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'

export const useTagsviewStore = defineStore('tagsview', {
  state: () => ({
    cachedViews: [] as any[],
    visitedViews: JSON.parse(localStorage.getItem('visitedViews') || '[]') as RouteLocationNormalized[],
  }),
  getters: {
    resolve(state) {
      return (view: Partial<RouteLocationRaw>) => {
        const route = this.router.resolve(view)
        return this.router.resolve(state.visitedViews.find(i => i.name === route.name || i.path === route.path) || route)
      }
    },
  },
  actions: {
    addView(view: RouteLocationNormalizedLoaded) {
      view = { ...view, matched: [] }
      if (view.meta.permission === false)
        return

      const index = this.visitedViews.findIndex(v => v.name === view.name)
      if (index < 0)
        this.visitedViews.push(view)
      else
        this.visitedViews[index] = view

      if (
        view?.name && !view.meta?.noCache
        && !this.cachedViews.includes(view.name!)
      )
        this.cachedViews.push(view?.name)
    },
    dropView(view: Partial<RouteLocationNormalized>) {
      this.dropVisitedView(view)
      this.dropCachedView(view)
    },
    dropVisitedView(view: Partial<RouteLocationNormalized>) {
      const index = this.visitedViews.findIndex(v => v.name === view.name)
      if (index >= 0)
        this.visitedViews.splice(index, 1)
    },
    dropCachedView(view: Partial<RouteLocationNormalized>) {
      const index = this.cachedViews.indexOf(view.name!)
      if (index >= 0)
        this.cachedViews.splice(index, 1)
    },
    delOthersViews(view?: Partial<RouteLocationNormalized>) {
      this.visitedViews = this.visitedViews.filter(v => v.name === view?.name)
      this.cachedViews = this.cachedViews.filter(v => v !== view?.name)
    },
    goBack(view?: Partial<RouteLocationNormalized>) {
      this.dropView(this.route)
      if (view)
        return this.push(view)

      this.router.go(-1)
    },
    async push(view: Partial<RouteLocationNormalized>) {
      if (view.name === this.route.name) {
        this.dropCachedView(view)
        return this.router.push('/reload')
      }

      this.router.push(this.resolve(view))
    },
  },

})
