import { roleList } from '../role'

export const userList = [
  { id: '1', username: 'admin', name: '管理员', password: 'password', email: '260480378@qq.com', status: 1, roles: [roleList[0]] },
]

export default defineEventHandler((event) => {
  const { pageIndex = '1', rows = '50' } = useQuery(event)
  return {
    data: userList.slice((Number(pageIndex) - 1) * Number(rows), Number(rows)).map(i => ({ ...i, password: '' })),
    total: userList.length,
  }
})
