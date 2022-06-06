import type { DepartmentRow } from '../department/api'
import { request } from '~/composables/request'

export interface Row {
  id?: string
  department?: DepartmentRow
  name?: string
  phone?: string
  photoName?: string
  birthday?: string
  job?: string
  rank?: string
  money?: string
  entryDate?: string
  retirementDate?: string
  address?: string
  sex?: 0 | 1
  status?: 0 | 1
  type?: 0 | 1
}

export function getStaffList(params: object) {
  return request<Row[]>('/person/getPersonList', {
    params: { status: 1, ...params },
  })
}

export function put(body: object) {
  return request('/person/updatePerson', {
    method: 'put',
    body,
  })
}

export function post(body: object) {
  return request('/person/insertPerson', {
    method: 'post',
    body,
  })
}

export function drop(id: any) {
  return request('/person/deletePerson', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
