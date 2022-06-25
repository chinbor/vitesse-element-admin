import { request } from '~/composables/request'

export interface Permission {
  id?: string
  name?: string
  remark?: string
}

export function getPermissionList(params?: object) {
  return request<Permission[]>('/role/resource/getById', {
    method: 'post',
    params,
  })
}

export function put(body: Permission) {
  return request('/resource/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Permission) {
  return request('/resource/add', {
    method: 'post',
    body,
  })
}
