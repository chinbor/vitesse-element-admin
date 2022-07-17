import type { Role } from '../role/api'
import type { Department } from '~/pages/department/api'
import { request } from '~/composables/request'

export interface User {
  id?: string
  index?: number
  name?: string
  username?: string
  password?: string
  confirmPassword?: string
  status?: boolean
  sex?: 0 | 1
  roles?: Role[]
  phone?: string
  department?: Department
  permissions?: string[]
}

export function getUserList(params: object) {
  return request<User[]>('/users', {
    params: { status: true, ...params },
  })
}

export function getUser(id: User['id']) {
  return request<User>(`/users/${id}`)
}

export function put({ id, ...body }: User) {
  return request(`/users/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: User) {
  return request('/users', {
    method: 'post',
    body,
  })
}

export function drop(id: User['id']) {
  return request(`/users/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}

export function login(body: any) {
  return request<string>('/login', {
    method: 'post',
    body,
  })
}

export function getUserInfo() {
  return request<User>('/user-info')
}
