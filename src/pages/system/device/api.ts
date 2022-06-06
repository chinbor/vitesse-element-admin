import { request } from '~/composables/request'

export interface Device {
  id?: string
  address?: string
  addressIp?: string
  loginName?: string
  loginPaw?: string
  name?: string
  port?: number
  status?: 0 | 1
  // 'type': 0
}

export function getDeviceList(params: object) {
  return request<Device[]>('/device/list', {
    params: { status: 1, ...params },
  })
}

export function put(body: Device) {
  return request('/device/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Device) {
  return request('/device/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Device['id']) {
  return request('/device/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
