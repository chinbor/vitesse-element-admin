import JSEncrypt from 'jsencrypt'
import type { Role } from '../role/api'
import type { Department } from '../department/api'
import { request } from '~/composables/request'

const encrypt = new JSEncrypt()
encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAogNcSeCMjhLesak3vKZGJtgX5vVGRjeegyF2bZ4U+yu0HFjGJJLwDYAZa1ptQM9+UlqlfH518McjvFLcRDhVL+dVnm2jlN1QI74JOhPY2f6ZwbM77orVEnz9MPLU6M+o9PUMGY6I4XLVcQcxNlOReD7u91zRyASjH4yg/KK8fSFsOS+JQXfxHVuEmCG89DaQB4zbHNWdDYAUbIQRAMRPEj3fRZSlfAchseN7+YNSFhjifmHhvArK1z97puVSKfcHXFOR1LhpSEYeN8luiSjmAc1jFxjI+EXbfxHG+fCRHCSqBbDDoyzSW9YN+wHsktZJRRL7E/rjsxmj4GWxht91uQIDAQAB')

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
  departments?: Department[]
  'department.id'?: Department['id']
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
    body: {
      ...body,
      username: body.username ? encrypt.encrypt(body.username) : body.username,
      password: body.password ? encrypt.encrypt(body.password) : body.password,
    },
  })
}

export function post(body: User) {
  return request('/user/add', {
    method: 'post',
    body: {
      ...body,
      username: body.username ? encrypt.encrypt(body.username) : body.username,
      password: body.password ? encrypt.encrypt(body.password) : body.password,
    },
  })
}

export function drop(id: User['id']) {
  return request('/user/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}

export function login({ username, password }: any) {
  return request<{ token: string; id: string }>('/admin/login', {
    method: 'post',
    body: {
      username: username ? encrypt.encrypt(username) : username,
      password: password ? encrypt.encrypt(password) : password,
    },
  })
}
