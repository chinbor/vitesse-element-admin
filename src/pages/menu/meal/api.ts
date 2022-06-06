import { request } from '~/composables/request'

export interface Meal {
  id?: string
  userName?: string
  foodName?: string
  status?: 0 | 1
}

export function getMealList(params: object) {
  return request<Meal[]>('/foodMeal/getFoodMeal', {
    params: { status: 1, ...params },
  })
}
