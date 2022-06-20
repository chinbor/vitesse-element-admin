export const questionTypeList = [
  { value: 0, type: 'input', label: '文本输入' },
  { value: 1, type: 'radio-group', label: '单选' },
  { value: 2, type: 'checkbox', label: '多选' },
  { value: 3, type: 'image', label: '上传图片' },
  { value: 4, type: 'alert', label: '标题' },
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
  answer?: { content: string }[]
  options?: {
    id?: string
    optionValue?: string
    answerFlag?: 0 | 1
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
