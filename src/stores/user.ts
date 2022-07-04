import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import { useRouteStore } from './route'
import { type User, getUserInfo, login } from '~/pages/system/user/api'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {} as User,
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
      this.router.push({ path: '/login', query: { redirect: this.route.fullPath } })

      useRouteStore().removeRouteList.forEach(i => i())
    },
  },
})
