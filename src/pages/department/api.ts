import { request } from '~/composables/request'

export interface Department {
  id?: string
  parentId?: Department['id']
  parentIds?: Department['id'][]
  name?: string
  remark?: string
  sort?: number
  hasChildren?: boolean
  status?: boolean
}

export function getDepartmentList(params?: object) {
  return request<Department[]>('/departments', {
    params,
  })
}

export function getDepartment(id: Department['id']) {
  return request<Department>(`/departments/${id}`)
}

export function put({ id, ...body }: Department) {
  return request(`/departments/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Department) {
  return request('/departments', {
    method: 'post',
    body,
  })
}

export function drop(id: Department['id']) {
  return request(`/departments/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
