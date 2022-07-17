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
  return request<Department[]>('/department', {
    params,
  })
}

export function getDepartment(id: Department['id']) {
  return request<Department>(`/department/${id}`)
}

export function put({ id, ...body }: Department) {
  return request(`/department/${id}`, {
    method: 'put',
    body,
  })
}

export function post(body: Department) {
  return request('/department', {
    method: 'post',
    body,
  })
}

export function drop(id: Department['id']) {
  return request(`/department/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
