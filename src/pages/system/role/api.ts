import { request } from '~/composables/request'

export interface Role {
  id?: string
  name?: string
  remark?: string
}

export function getRoleList(params: object) {
  return request<Role[]>('/role/list', {
    params: { status: 1, ...params },
  })
}

export function getRole(id: Role['id']) {
  return request<Role>('/role/getById', {
    params: { id },
  })
}

export function put(body: Role) {
  return request('/role/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Role) {
  return request('/role/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Role['id']) {
  return request('/role/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
