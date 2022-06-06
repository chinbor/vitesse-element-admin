import { request } from '~/composables/request'

export interface RoleRow {
  id?: string
  roleName?: string
  roleNameZh?: string
}

export function getRoleList(params: object) {
  return request<RoleRow[]>('/getRoles', {
    params,
  })
}

export function put(body: RoleRow) {
  return request('/updateRole', {
    method: 'POST',
    body,
  })
}

export function post(body: RoleRow) {
  return request('/addRole', {
    method: 'post',
    body,
  })
}

export function drop(id: RoleRow['id']) {
  return request(`/roles/del/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
