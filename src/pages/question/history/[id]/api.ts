export interface Answer {
  id?: string
  name?: string
  description?: string
  status?: 0 | 1
  sort?: number
}

export function getAnswerList(params?: object) {
  return request<Answer[]>('/question/answer/list', {
    params: { status: 1, ...params },
  })
}

export function getAnswer(id: Answer['id']) {
  return request<Answer>('/question/answer/getById', {
    params: { id },
  })
}

export function put(body: Answer) {
  return request('/question/answer/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Answer) {
  return request('/question/answer/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Answer['id']) {
  return request('/question/answer/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
