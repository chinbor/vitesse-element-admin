import type { RepairType } from '../type/api'
export const repairStatusList = [
  { label: '申请中', value: 0 },
  { label: '处理中', value: 1 },
  { label: '已解决', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已取消', value: 4 },
] as const

export interface Repair {
  classificationId?: string
  id?: string
  repairsContent?: string
  department?: string
  contacts?: string
  contactsPhone?: string
  handler?: string
  handlerPhone?: string
  result?: string
  classification?: RepairType
  'classification.id'?: RepairType['id']
  status?: typeof repairStatusList[number]['value']
  remark?: string
}

export function getRepairList(params: object) {
  return request<Repair[]>('/repairs/list', {
    params: { status: 1, ...params },
  })
}

export function getRepair(id: string) {
  return request<Repair>('/repairs/getById', {
    params: { id },
  })
}

export function put(body: Repair) {
  return request('/repairs/edit', {
    method: 'put',
    body,
  })
}

export function post(body: Repair) {
  return request('/repairs/add', {
    method: 'post',
    body,
  })
}

export function drop(id?: string) {
  return request('/repairs/delete', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
