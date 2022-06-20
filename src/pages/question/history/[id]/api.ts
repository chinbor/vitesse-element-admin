export interface Answer {
  id?: string
  name?: string
  description?: string
  status?: 0 | 1
  sort?: number
}

export function getAnswerList(params?: object) {
  return request<Answer[]>('/question/questionnaireHistoryItem/list', {
    params: { status: 1, ...params },
  })
}
