export interface Permission {
  id?: string
  resources?: string[]
}

const permissionList = useLocalStorage<Permission['resources']>('permissionList', [])
export function getPermissionList(params?: object) {
  return { data: permissionList.value! }
  // return request<Permission[]>('/role/resource/getById', {
  //   method: 'post',
  //   params,
  // })
}

export function put(body: Permission) {
  permissionList.value = body.resources
  // return request('/resource/edit', {
  //   method: 'put',
  //   body,
  // })
}

export function post(body: Permission) {
  return request('/resource/add', {
    method: 'post',
    body,
  })
}
