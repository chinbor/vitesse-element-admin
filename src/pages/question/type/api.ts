export interface QuestionType {
  id?: string
  name?: string
  status?: 0 | 1
  sort?: number
}

export function getQuestionTypeList(params: object) {
  return request<QuestionType[]>('/question/classification/list', {
    params: { status: 1, ...params },
  })
}

export function getQuestionType(id: QuestionType['id']) {
  return request<QuestionType>('/question/classification/getById', {
    params: { id },
  })
}

export function put(body: QuestionType) {
  return request('/question/classification/edit', {
    method: 'put',
    body,
  })
}

export function post(body: QuestionType) {
  return request('/question/classification/add', {
    method: 'post',
    body,
  })
}

export function drop(id: QuestionType['id']) {
  return request('/question/classification/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
