export interface Permission {
  id?: string
  permissions: string[]
}

export async function getPermissionList({ id }: any) {
  return request<Permission['permissions']>(`/roles/${id}/permissions`)
}

export function put({ id, permissions }: Permission) {
  return request(`/roles/${id}/permissions`, {
    method: 'put',
    body: {
      permissions,
    },
  })
}
