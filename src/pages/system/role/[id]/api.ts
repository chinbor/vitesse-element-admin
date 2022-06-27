export interface Permission {
  id?: string
  resources?: string[]
}

export async function getPermissionList(params?: object) {
  return request<Permission['resources']>('/role/resource/getById', {
    params,
    // @ts-expect-error ignore
  }).then(({ data }) => ({ data: data.resources?.map(i => i.path) }))
}

export function put({ id, resources }: Permission) {
  return request('/role/resource/edit', {
    method: 'put',
    body: {
      id,
      resources: resources?.map(i => ({ path: i })),
    },
  })
}
