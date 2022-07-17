import { request } from '~/composables/request'

export interface Role {
  id?: string
  name?: string
  remark?: string
  status?: Boolean
  index?: number
}

export function getRoleList(params: object) {
  return request<Role[]>('/roles', {
    params: { status: true, ...params },
  })
}

export function getRole(id: Role['id']) {
  return request<Role>(`/roles/${id}`)
}

export function put({ id, ...body }: Role) {
  return request(`/roles/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Role) {
  return request('/roles', {
    method: 'post',
    body,
  })
}

export function drop(id: Role['id']) {
  return request(`/roles/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
