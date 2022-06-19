import { request } from '~/composables/request'

export interface Department {
  id?: string
  parentId?: Department['id']
  name?: string
  remark?: string
  sort?: number
  hasChildren?: boolean
}

export function getDepartmentList(params?: object) {
  return request<Department[]>('/department/list', {
    params: { status: 1, ...params },
  }).then((i) => {
    i.data = i.data.map(i => ({ ...i, hasChildren: !i.hasChildren }))
    return i
  })
}

export function getDepartment(id: Department['id']) {
  return request<Department>('/department/getById', {
    params: { id },
  })
}

export function put(body: Department) {
  return request('/department/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Department) {
  return request('/department/add', {
    method: 'post',
    body,
  })
}

export function drop(id: Department['id']) {
  return request('/department/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
