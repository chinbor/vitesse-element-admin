import type { Question } from '../../template/[id]/api'

export function getHistoryItemList(params?: object) {
  return request<Question[]>('/question/questionnaireHistoryItem/list', {
    params: { status: 1, ...params },
  })
}
