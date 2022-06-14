import type { QuestionType } from '../type/api'
export interface Template {
  classificationId?: string
  id?: string
  title?: string
  preface?: string
  content?: string
  classification?: QuestionType[]
  sort?: number
  status?: 0 | 1
  remark?: string
}

export function getTemplateList(params: object) {
  return request<Template[]>('/question/template/list', {
    params: { status: 1, ...params },
  })
}

export function getTemplate(id: Template['id']) {
  return request<Template>('/question/template/getById', {
    params: { id },
  })
}

export function put(body: Template) {
  return request('/question/template/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Template) {
  return request('/question/template/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Template['id']) {
  return request('/question/template/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
