export interface EnumGroup {
  id: string
  name: string
  description: string
  status: boolean
  index: number
}

export function getEnumGroupList(params?: object) {
  return request<EnumGroup[]>('/enum-groups', {
    params: { status: true, ...params },
  })
}

export function getEnumGroup(id: EnumGroup['id']) {
  return request<EnumGroup>(`/enum-groups/${id}`)
}

export function put({ id, ...body }: Partial<EnumGroup>) {
  return request(`/enum-groups/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: EnumGroup) {
  return request('/enum-groups', {
    method: 'post',
    body,
  })
}

export function drop(id: EnumGroup['id']) {
  return request(`/enum-groups/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
