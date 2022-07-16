export const list = [
  { id: '0', name: '管理员', status: true, permissions: [
    '/role', '/role/post', '/role/id/put', '/role/id/delete', '/role/id', '/role/id/permission', '/role/id/permission/put',
    '/user', '/user/id/put',
    '/department', '/department/id/put', '/department/post', '/department/id/delete',
  ] },
]

export const getRoleList = query => list
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getRoleList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(pageSize)),
    total: data.length,
  }
})
