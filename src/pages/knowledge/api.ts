export interface Knowledge {
  id?: string
  name?: string
  description?: string
  status?: boolean
  sort?: number
}

export function getKnowledgeTypeList(params?: object) {
  return request<Knowledge[]>('/knowledge', {
    params: { status: true, ...params },
  })
}

export function getKnowledgeType(id: Knowledge['id']) {
  return request<Knowledge>(`/knowledge/${id}`)
}

export function put({ id, ...body }: Knowledge) {
  return request(`/knowledge/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Knowledge) {
  return request('/knowledge', {
    method: 'post',
    body,
  })
}

export function drop(id: Knowledge['id']) {
  return request(`/knowledge/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
