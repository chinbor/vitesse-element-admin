import { defineStore } from 'pinia'
import type { System } from '~/pages/system/settings/api'
import { getSystemList } from '~/pages/system/settings/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    name: '后台管理系统',
    description: 'Vitesse Background Management System',
    logo: '/logo.png',
    pageSize: 50,
    list: [] as System[],
  }),
  actions: {
    async getList() {
      try {
        ({ data: this.list } = await getSystemList());
        ({
          name: this.name,
          logo: this.logo,
          pageSize: this.pageSize,
        } = this.list.reduce((a: any, b) => (a[b.prop] = b.value, a), {}))
      } catch {}
    },
  },
})
