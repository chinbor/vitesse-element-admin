import { $fetch } from 'ohmyfetch'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { useUserStore } from '~/stores/user'

export const baseURL = '/api'

export function getHeaders(defaultHeaders = {}) {
  return {
    ...defaultHeaders,
    Authorization: useUserStore().token,
  }
}

const _fetch = $fetch.create({
  baseURL,
  async onRequest({ options }) {
    NProgress.start()
    options.params = options.params && JSON.parse(JSON.stringify(options.params))
    options.body = options.body && JSON.parse(JSON.stringify(options.body))
    options.headers = getHeaders(options.headers)
  },
  async onResponse() {
    NProgress.done()
  },
  async onResponseError({ response, options }) {
    options?.params?.noMessage || ElMessage({ message: response._data.message || '服务器错误', grouping: true, type: 'error' })

    if (response.status === 401)
      useUserStore().logout()
  },
})

export const request = <T>(...args: Parameters<typeof _fetch>) => _fetch<{
  data: T
  message: string
  total: number
  // @ts-expect-error ignore
}>(...args)
