export interface KnowledgeType {
  id?: string
  title?: string
  description?: string
  status?: 0 | 1
  iconPath?: string
  sort?: number
}

export function getKnowledgeTypeList(params?: object) {
  return request<KnowledgeType[]>('/knowledgeBase/list', {
    params: { status: 1, ...params },
  })
}

export function getKnowledgeType(id: KnowledgeType['id']) {
  return request<KnowledgeType>('/knowledgeBase/getById', {
    params: { id },
  })
}

export function put(body: KnowledgeType) {
  return request('/knowledgeBase/edit', {
    method: 'put',
    body,
  })
}

export function post(body: KnowledgeType) {
  return request('/knowledgeBase/add', {
    method: 'post',
    body,
  })
}

export function drop(id: KnowledgeType['id']) {
  return request('/knowledgeBase/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
