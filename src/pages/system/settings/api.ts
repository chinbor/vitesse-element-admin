import { cloneDeep } from 'lodash-es'
import { request } from '~/composables/request'

export interface System {
  id?: string
  prop: string
  type?: string
  label?: string
  required?: boolean
  value: string
  originValue?: string
  description?: string
  options?: { label: string; value: string }[]
}

export function getSystemList(params?: object) {
  return request<System[]>('/settings', {
    params,
  }).then((i) => {
    i.data = i.data.map(i => ({ ...i, originValue: cloneDeep(i.value) }))
    return i
  })
}

export function put({ id, ...body }: System) {
  return request(`/settings/${id}`, {
    method: 'put',
    body,
  })
}
