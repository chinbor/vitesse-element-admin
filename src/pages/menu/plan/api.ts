import type { FoodRow } from '../food/api'
import { request } from '~/composables/request'

export interface Plan {
  id: string
  date: string
  foodInfo: FoodRow[]
  mealType: 1 | 2 | 3
  status: 0 | 1
  'minDate,maxDate': string
}

export function getPlanList(params: object) {
  return request<Plan[]>('/foodMenu/getMenu', {
    params: { status: 1, ...params },
  })
}

export function put(body: Plan) {
  return request('/foodMenu/updateMenu', {
    method: 'put',
    body,
  })
}

export function post(body: Plan) {
  return request('/foodMenu/addMenu', {
    method: 'post',
    body,
  })
}

export function drop(id: Plan['id']) {
  return request(`/foodMenu/deleteMenu/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
