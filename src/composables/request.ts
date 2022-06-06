import { $fetch } from 'ohmyfetch'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { useUserStore } from '~/stores/user'
export const baseURL = '/api'

const whiteList = ['/api/sys/user/queryUserRole']

export function getHeaders() {
  const userStore = useUserStore()
  return JSON.parse(JSON.stringify({ Authorization: userStore.token ? `Bearer ${`${userStore.token}`}` : undefined, RefreshToken: userStore.userInfo.refreshToken }))
}

const _fetch = $fetch.create({
  baseURL,
  async onRequest({ options }) {
    NProgress.start()
    options.params = options.params && JSON.parse(JSON.stringify(options.params))
    options.body = options.body && JSON.parse(JSON.stringify(options.body))
    options.headers = getHeaders()
  },
  async onResponse({ response, options, request }) {
    NProgress.done()
    const data = response._data

    if (['blob', 'text'].includes(options.responseType!))
      return

    /** 续签Token */
    if (response.status === 201)
      useUserStore().token = response.headers.get('token')!

    if (data.code === 200 || whiteList.includes(request.toString())) {
      response._data = {
        message: data.msg,
        data: data.data.data ?? data.data,
        total: data.data.total,
      }
      return
    }

    options?.params?.noMessage || ElMessage({ message: data.msg || '服务器错误', grouping: true, type: 'error' })

    if (response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
    }
    throw new Error(data)
  },
})

export const request = <T>(...args: Parameters<typeof _fetch>) => _fetch<{
  data: T
  message: string
  total: number
  // @ts-expect-error ignore
}>(...args)
