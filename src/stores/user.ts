import { defineStore } from 'pinia'
import { useRouteStore } from './route'
import { login } from '~/pages/system/user/api'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    permissionList: JSON.parse(localStorage.getItem('permissionList') || '[]'),
  }),
  actions: {
    async login(body: any) {
      const { data: { token, ...userInfo } } = await login(body)
      this.token = token
      this.userInfo = userInfo
      this.router.push(<string> this.route.query.redirect || '/')
    },
    async getPermissionList() {
      return this.permissionList
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
