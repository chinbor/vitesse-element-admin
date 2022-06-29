import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import { useRouteStore } from './route'
import { type User, getUser, login } from '~/pages/system/user/api'
import { getPermissionList } from '~/pages/system/role/[id]/api'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {} as User,
    userId: localStorage.getItem('userId') || '',
    permissionList: [] as string[],
  }),
  actions: {
    async login(body: any) {
      const { data: { token, id } } = await login(body)
      this.token = token
      this.userId = id
      this.router.push(<string> this.route.query.redirect || '/')
    },
    async getUserInfo() {
      const { close } = ElLoading.service({ fullscreen: true, text: '获取权限中...' })
      try {
        ({ data: this.userInfo } = await getUser(this.userId))
        ;({ data: this.permissionList } = await getPermissionList({ id: this.userInfo.roles?.[0].id }))
        return { ...this.userInfo, permissionList: this.permissionList }
      } finally {
        close()
      }
    },
    async logout() {
      this.token = ''
      this.permissionList = []
      this.router.push({ path: '/login', query: { redirect: this.route.fullPath } })

      useRouteStore().removeRouteList.forEach(i => i())
    },
  },
})
