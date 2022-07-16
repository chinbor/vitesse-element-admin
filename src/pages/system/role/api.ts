import { request } from '~/composables/request'

export interface Role {
  id?: string
  name?: string
  remark?: string
  status?: Boolean
}

export function getRoleList(params: object) {
  return request<Role[]>('/role', {
    params: { status: true, ...params },
  })
}

export function getRole(id: Role['id']) {
  return request<Role>(`/role/${id}`)
}

export function put({ id, ...body }: Role) {
  return request(`/role/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Role) {
  return request('/role', {
    method: 'post',
    body,
  })
}

export function drop(id: Role['id']) {
  return request(`/role/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
