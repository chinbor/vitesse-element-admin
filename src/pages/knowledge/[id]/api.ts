import type { Knowledge } from '../api'

export interface KnowledgeContent {
  id?: string
  title?: string
  content?: string
  knowledge?: Knowledge
  sort?: number
  status?: boolean
}

export function getKnowledgeContentList({ knowledge, ...params }: KnowledgeContent) {
  return request<KnowledgeContent[]>(`/knowledge/${knowledge?.id}/contents`, {
    params: { status: true, ...params },
  })
}

export function getKnowledgeContent({ id, knowledge }: KnowledgeContent) {
  return request<KnowledgeContent>(`/knowledge/${knowledge?.id}/contents/${id}`)
}

export function put(body: KnowledgeContent) {
  return request(`/knowledge/${body.knowledge?.id}/contents/${body.id}`, {
    method: 'put',
    body,
  })
}

export function post(body: KnowledgeContent) {
  return request(`/knowledge/${body.knowledge?.id}/contents`, {
    method: 'post',
    body,
  })
}

export function drop(id?: string, knowledgeId?: string) {
  return request(`/knowledge/${knowledgeId}/contents/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
