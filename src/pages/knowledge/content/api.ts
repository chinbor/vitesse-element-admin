import type { KnowledgeType } from '../type/api'
export interface KnowledgeContent {
  classificationId?: string
  id?: string
  title?: string
  preface?: string
  content?: string
  knowledgeBase?: KnowledgeType[]
  'knowledgeBase.id'?: KnowledgeType['id']
  sort?: number
  status?: 0 | 1
  remark?: string
}

export function getTemplateList(params: object) {
  return request<KnowledgeContent[]>('/knowledgeContent/list', {
    params: { status: 1, ...params },
  })
}

export function getTemplate(id: string) {
  return request<KnowledgeContent>('/knowledgeContent/getById', {
    params: { id },
  })
}

export function put(body: KnowledgeContent) {
  return request('/knowledgeContent/edit', {
    method: 'put',
    body,
  })
}

export function post(body: KnowledgeContent) {
  return request('/knowledgeContent/add', {
    method: 'post',
    body,
  })
}

export function drop(id?: string) {
  return request('/knowledgeContent/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
