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
