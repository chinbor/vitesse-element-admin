import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import { useRouteStore } from './route'
import { request } from '~/composables/request'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    permissionList: [] as string[],
  }),
  actions: {
    async login(body: any) {
      const loading = ElLoading.service({ fullscreen: true })
      const { data: { token, ...userInfo } } = await request<{ token: string }>('/login', {
        method: 'post',
        body,
      }).finally(() => loading.close())
      this.token = token
      this.userInfo = userInfo
      this.router.push(<string> this.route.query.redirect || '/')
    },
    async getPermissionList() {
      const permission = [{ url: '/get/user' }]
      return this.permissionList = permission.map((i: any) => i.url)
    },
    hasPermission(val: string) {
      return this.permissionList.includes(val)
    },
    async logout() {
      this.token = ''
      this.userInfo = {}
      this.permissionList = []
      this.route.name !== 'login' && this.router.push({ path: '/login', query: { redirect: this.route.fullPath } })

      useRouteStore().removeRouteList.forEach(i => i())
    },
  },
})
