import { defineStore } from 'pinia'
import { useRouteStore } from './route'
import { login } from '~/pages/system/user/api'
import { getPermissionList } from '~/pages/system/role/[id]/api'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    permissionList: [] as string[],
  }),
  actions: {
    async login(body: any) {
      const { data: { token, ...userInfo } } = await login(body)
      this.token = token
      this.userInfo = userInfo
      this.router.push(<string> this.route.query.redirect || '/')
    },
    async getPermissionList() {
      const { data } = await getPermissionList()
      return this.permissionList = data
    },
    async logout() {
      this.token = ''
      this.userInfo = {}
      this.permissionList = []
      this.router.push({ path: '/login', query: { redirect: this.route.fullPath } })

      useRouteStore().removeRouteList.forEach(i => i())
    },
  },
})
