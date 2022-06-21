import type { Question } from '../../template/[id]/api'

export function getStatisticsList(params?: object) {
  return request<Question[]>('/question/questionnaireCount/list', {
    params: { status: 1, ...params },
  })
}
