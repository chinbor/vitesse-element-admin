import type { Template } from '../template/api'

export interface Questionnaire {
  id?: string
  name?: string
  username?: string
  password?: string
  confirmPassword?: string
  status?: 0 | 1
  sex?: 0 | 1
  roleId?: string
  roles?: Template[]
  phone?: string
}

export function getQuestionnaireList(params: object) {
  return request<Questionnaire[]>('/question/questionnaire/list', {
    params: { status: 1, ...params },
  })
}

export function getQuestionnaire(id: Questionnaire['id']) {
  return request<Questionnaire>('/question/questionnaire/getById', {
    params: { id },
  })
}

export function put(body: Questionnaire) {
  return request('/question/questionnaire/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Questionnaire) {
  return request('/question/questionnaire/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Questionnaire['id']) {
  return request('/question/questionnaire/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
