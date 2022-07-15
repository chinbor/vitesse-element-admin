import { roleList } from '../role'

export const userList = [
  { id: '0', username: 'admin', name: '管理员', password: 'password', email: '260480378@qq.com', status: 1, roles: [roleList[0]] },
]

export default defineEventHandler((event) => {
  const { pageIndex = '1', rows = '50', ...query } = useQuery(event)
  return {
    data: userList.slice((Number(pageIndex) - 1) * Number(rows), Number(rows))
      .reduce((a, b) => Object.keys(query).filter(key => !!Reflect.has(roleList[0], key)).find(key => !(`${b[key]}`).includes(<string>query[key])) ? a : [...a, b], [])
      .map(i => ({ ...i, password: '' })),
    total: userList.length,
  }
})
