export interface Enum {
  id?: string
  name?: string
  type?: string
  status?: 0 | 1
  iconPath?: string
  sort?: number
}

export function getEnumList(params?: object) {
  return request<Enum[]>('/enum/list', {
    params: { status: 1, ...params },
  })
}

export function getEnum(id: Enum['id']) {
  return request<Enum>('/enum/getById', {
    params: { id },
  })
}

export function put(body: Enum) {
  return request('/enum/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Enum) {
  return request('/enum/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Enum['id']) {
  return request('/enum/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
