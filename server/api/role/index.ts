export const roleList = [
  { id: '1', name: '管理员', permissions: [
    '/role', '/role/post', '/role/id/put', '/role/id/delete', '/role/id', '/role/id/permission', '/role/id/permission/put',
    '/user', '/user/id/put',
    '/department', '/department/id/put', '/department/post', '/department/id/delete',
  ] },
]

export default defineEventHandler((event) => {
  const { pageIndex = '1', pageSize = '50', ...query } = useQuery(event)

  return {
    data: roleList.slice((Number(pageIndex) - 1) * Number(pageSize), Number(pageSize))
      .reduce((a, b) => Object.keys(query).filter(key => !!Reflect.has(roleList[0], key)).find(key => !(`${b[key]}`).includes(<string>query[key])) ? a : [...a, b], []),
    total: roleList.length,
  }
})
