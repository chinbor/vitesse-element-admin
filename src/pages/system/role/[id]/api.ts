export interface Permission {
  id?: string
  permissions: string[]
}

export async function getPermissionList({ id }: any) {
  return request<Permission['permissions']>(`/role/${id}/permission`)
}

export function put({ id, permissions }: Permission) {
  return request(`/role/${id}/permission`, {
    method: 'put',
    body: {
      permissions,
    },
  })
}
