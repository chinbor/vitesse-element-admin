export const roleList = [
  { id: '1', name: '管理员', permissions: ['/role', '/role/post', '/role/id/put', '/role/id/delete', '/role/id', '/role/id/permission', '/role/id/permission/put'] },
]

export default defineEventHandler((event) => {
  const { pageIndex = '1', pageSize = '50' } = useQuery(event)

  return {
    data: roleList.slice((Number(pageIndex) - 1) * Number(pageSize), Number(pageSize)),
    total: roleList.length,
  }
})
