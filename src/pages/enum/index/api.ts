import type { EnumGroup } from '../group/api'

export interface Enum {
  id?: string
  name?: string
  group?: EnumGroup
  description?: string
  status?: boolean
  iconPath?: string
  index?: number
}

export function getEnumList(params?: object) {
  return request<Enum[]>('/enums', {
    params: { status: true, ...params },
  })
}

export function getEnum(id: Enum['id']) {
  return request<Enum>(`/enums/${id}`)
}

export function put({ id, ...body }: Enum) {
  return request(`/enums/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Enum) {
  return request('/enums', {
    method: 'post',
    body,
  })
}

export function drop(id: Enum['id']) {
  return request(`/enums/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
