import type { Role } from '../role/api'
import type { Department } from '../department/api'
import { request } from '~/composables/request'

export interface User {
  id?: string
  name?: string
  username?: string
  password?: string
  confirmPassword?: string
  status?: boolean
  sex?: 0 | 1
  'roles.id'?: string
  roles?: Role[]
  phone?: string
  departments?: Department[]
  'department.id'?: Department['id']
  permissions?: string[]
}

export function getUserList(params: object) {
  return request<User[]>('/user', {
    params: { status: true, ...params },
  })
}

export function getUser(id: User['id']) {
  return request<User>(`/user/${id}`)
}

export function put({ id, ...body }: User) {
  return request(`/user/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: User) {
  return request('/user', {
    method: 'post',
    body,
  })
}

export function drop(id: User['id']) {
  return request(`/user/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}

export function login(body: any) {
  return request<string>('/user/login', {
    method: 'post',
    body,
  })
}

export function getUserInfo() {
  return request<User>('/user/info')
}
