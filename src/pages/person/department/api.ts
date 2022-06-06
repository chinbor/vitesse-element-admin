import { request } from '~/composables/request'

export interface DepartmentRow {
  id: string
  depId: number
  description: string
  departmentName: string
  phone: string
  photoName: string
  status: 0 | 1
  type: 0 | 1
}

export function getDepartmentList(params: object) {
  return request<DepartmentRow[]>('/dep/getDepList', {
    params: { status: 1, ...params },
  })
}

export function put(body: object) {
  return request('/dep/updateDep', {
    method: 'put',
    body,
  })
}

export function post(body: object) {
  return request('/dep/insertDep', {
    method: 'post',
    body,
  })
}

export function drop(id: any) {
  return request('/dep/deleteDep', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
