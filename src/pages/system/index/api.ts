import { request } from '~/composables/request'

export interface System {
  id?: string
  type?: string
  label?: string
  required?: boolean
  value?: string
  originValue?: string
  description?: string
  options?: { label: string; value: string }[]
}

export function getSystemList(params?: object) {
  return request<System[]>('/setting/list', {
    params,
  })
}

export function put(body: System) {
  return request('/setting/edit', {
    method: 'put',
    body,
  })
}
