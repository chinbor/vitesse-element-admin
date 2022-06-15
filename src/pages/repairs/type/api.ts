export interface RepairType {
  id?: string
  name?: string
  description?: string
  status?: 0 | 1
  iconPath?: string
  sort?: number
}

export function getRepairTypeList(params?: object) {
  return request<RepairType[]>('/repairsClassification/list', {
    params: { status: 1, ...params },
  })
}

export function getRepairType(id: RepairType['id']) {
  return request<RepairType>('/repairsClassification/getById', {
    params: { id },
  })
}

export function put(body: RepairType) {
  return request('/repairsClassification/edit', {
    method: 'put',
    body,
  })
}

export function post(body: RepairType) {
  return request('/repairsClassification/add', {
    method: 'post',
    body,
  })
}

export function drop(id: RepairType['id']) {
  return request('/repairsClassification/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
