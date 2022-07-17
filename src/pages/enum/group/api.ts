export interface EnumGroup {
  id?: string
  name?: string
  description?: string
  status?: boolean
  index?: number
}

export function getEnumGroupList(params?: object) {
  return request<EnumGroup[]>('/enum/group', {
    params: { status: true, ...params },
  })
}

export function getEnumGroup(id: EnumGroup['id']) {
  return request<EnumGroup>(`/enum/group/${id}`)
}

export function put({ id, ...body }: EnumGroup) {
  return request(`/enum/group/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: EnumGroup) {
  return request('/enum/group', {
    method: 'post',
    body,
  })
}

export function drop(id: EnumGroup['id']) {
  return request(`/enum/group/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
