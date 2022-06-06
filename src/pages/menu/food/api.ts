import type { FoodTypeRow } from '../food-type/api'
import { request } from '~/composables/request'

export interface FoodRow {
  id?: string
  foodEnums: FoodTypeRow & { name: string }[]
  name?: string
  calorie?: string
  photoName?: string
  status?: 0 | 1
}

export function getFoodList(params: object) {
  return request<FoodRow[]>('/food/getFoods', {
    params: { status: 1, ...params },
  })
}

export function put(body: FoodRow) {
  return request('/food/updateFood', {
    method: 'put',
    body,
  })
}

export function post(body: FoodRow) {
  return request('/food/addFoods', {
    method: 'post',
    body,
  })
}

export function drop(id: FoodRow['id']) {
  return request('/food/deleteFoods', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
