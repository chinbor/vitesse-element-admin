import type { QuestionType } from '../type/api'
export interface Questionnaire {
  classificationId?: string
  id?: string
  title?: string
  preface?: string
  content?: string
  frequency?: number
  classification?: QuestionType[]
  sort?: number
  status?: 0 | 1
  remark?: string
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
