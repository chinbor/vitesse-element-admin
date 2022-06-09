import { defineStore } from 'pinia'
import type { RouteLocationNormalized, RouteRecordName, RouteRecordRaw } from 'vue-router'

export const useTagsviewStore = defineStore('tagsview', {
  state: () => ({
    cachedViews: [] as any[],
    visitedViews: JSON.parse(localStorage.getItem('visitedViews') || '[]') as RouteLocationNormalized[],
  }),
  getters: {
    resolve: state => (view: RouteLocationNormalized | RouteRecordRaw) => state.visitedViews.find(i => i.name === view.name || i.path === view.path) || view,
  },
  actions: {
    addView(view: RouteLocationNormalized) {
      view = { ...view }
      if (view.meta.hidden)
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
    dropView(view: Pick<RouteLocationNormalized, 'name'>) {
      this.dropVisitedView(view)
      this.dropCachedView(view)
    },
    dropVisitedView(view: Pick<RouteLocationNormalized, 'name'>) {
      const index = this.visitedViews.findIndex(v => v.name === view.name)
      if (index >= 0)
        this.visitedViews.splice(index, 1)
    },
    dropCachedView(view: Pick<RouteLocationNormalized, 'name'>) {
      const index = this.cachedViews.indexOf(view.name!)
      if (index >= 0)
        this.cachedViews.splice(index, 1)
    },
    delOthersViews(view?: Pick<RouteLocationNormalized, 'name'>) {
      this.visitedViews = this.visitedViews.filter(v => v.name === view?.name)
      this.cachedViews = this.cachedViews.filter(v => v !== view?.name)
    },
    goBack(name?: RouteRecordName | null) {
      this.dropView(this.route)
      if (name)
        this.push(name)
      else
        this.router.go(-1)
    },
    push(name?: RouteRecordName | null, forceRefresh = false) {
      name ??= this.route.name
      if (name === this.route.name) {
        this.dropView(this.route)
        return this.router.push('/reload')
      }
      if (forceRefresh)
        this.dropCachedView(this.route)
      this.router.push(this.resolve({ name } as RouteLocationNormalized))
    },
  },

})
