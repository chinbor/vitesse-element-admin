export const questionTypeList = [
  { value: 0, label: '文本输入' },
  { value: 1, label: '单选' },
  { value: 2, label: '多选' },
  { value: 3, label: '上传图片' },
  { value: 4, label: '标题' },
] as const

export interface Question {
  id?: string
  templateId?: string
  content?: string
  status?: 0 | 1
  questionFlag?: 0 | 1
  required?: 0 | 1
  sort?: number
  type?: typeof questionTypeList[number]['value']
  options?: {
    content?: string
    optionValue?: string
  }[]
}

export function getQuestionList(params?: object) {
  return request<Question[]>('/question/question/list', {
    params: { status: 1, ...params },
  })
}

export function getQuestion(id: Question['id']) {
  return request<Question>('/question/question/getById', {
    params: { id },
  })
}

export function put(body: Question) {
  return request('/question/question/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Question) {
  return request('/question/question/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Question['id']) {
  return request('/question/question/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
