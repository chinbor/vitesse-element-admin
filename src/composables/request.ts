import { $fetch } from 'ohmyfetch'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { useUserStore } from '~/stores/user'
export const baseURL = '/sys'

const whiteList = ['/api/sys/user/queryUserRole']

export function getHeaders() {
  const userStore = useUserStore()
  return JSON.parse(JSON.stringify({ token: userStore.token ? userStore.token : undefined }))
}

const _fetch = $fetch.create({
  baseURL,
  async onRequest({ options }) {
    NProgress.start()
    if (options.params?.pageSize) {
      options.params.rows = options.params.pageSize
      Reflect.deleteProperty(options.params, 'pageSize')
    }
    options.params = options.params && JSON.parse(JSON.stringify(options.params))
    options.body = options.body && JSON.parse(JSON.stringify(options.body))
    options.headers = getHeaders()
  },
  async onResponse({ response, options, request }) {
    NProgress.done()

    if (['blob', 'text'].includes(options.responseType!))
      return

    if (response._data.code === 200 || whiteList.includes(request.toString()))
      return

    options?.params?.noMessage || ElMessage({ message: response._data.msg || '服务器错误', grouping: true, type: 'error' })

    if (response.status === 403) {
      const userStore = useUserStore()
      userStore.logout()
    }
    throw new Error(response._data)
  },
})

export const request = <T>(...args: Parameters<typeof _fetch>) => _fetch<{
  data: T
  msg: string
  total: number
  // @ts-expect-error ignore
}>(...args)
