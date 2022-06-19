export interface History {
  id?: string
  title?: string
  preface?: string
  content?: string
  status?: 0 | 1
  sort?: number
}

export function getHistoryList(params?: object) {
  return request<History[]>('/question/questionnaireHistory/list', {
    params: { status: 1, ...params },
  })
}

export function getHistory(id: History['id']) {
  return request<History>('/question/questionnaireHistory/getById', {
    params: { id },
  })
}

export function put(body: History) {
  return request('/question/questionnaireHistory/edit', {
    method: 'put',
    body,
  })
}

export function post(body: History) {
  return request('/question/questionnaireHistory/add', {
    method: 'post',
    body,
  })
}

export function drop(id: History['id']) {
  return request('/question/questionnaireHistory/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
