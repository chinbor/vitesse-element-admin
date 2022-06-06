import { request } from '~/composables/request'

export interface FoodTypeRow {
  id: string
  enumName: string
  status: 0 | 1
}

export function getFoodTypeList(params: object) {
  return request<FoodTypeRow[]>('/enum/getFoodEnum', {
    params: { status: 1, ...params },
  })
}

export function put(body: FoodTypeRow) {
  return request('/enum/updateFoodEnum', {
    method: 'put',
    body,
  })
}

export function post(body: FoodTypeRow) {
  return request('/enum/addFoodEnum', {
    method: 'post',
    body,
  })
}

export function drop(id: FoodTypeRow['id']) {
  return request(`/enum/deleteFoodEnum/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
