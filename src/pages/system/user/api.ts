import type { Role } from '../role/api'
import { request } from '~/composables/request'

export interface User {
  id?: string
  name?: string
  username?: string
  password?: string
  confirmPassword?: string
  status?: 0 | 1
  sex?: 0 | 1
  'roles.id'?: string
  roles?: Role[]
  phone?: string
}

export function getUserList(params: object) {
  return request<User[]>('/user/list', {
    params: { status: 1, ...params },
  })
}

export function getUser(id: User['id']) {
  return request<User>('/user/getById', {
    params: { id },
  })
}

export function put(body: User) {
  return request('/user/edit', {
    method: 'put',
    body,
  })
}

export function post(body: User) {
  return request('/user/add', {
    method: 'post',
    body,
  })
}

export function drop(id: User['id']) {
  return request('/user/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
