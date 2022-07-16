import { getRoleList } from '../role'

export const list = [
  { id: '0', username: 'admin', name: '管理员', password: 'password', email: '260480378@qq.com', status: true, roles: ['0'] },
]

export const getUserList = query => list
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .map(i => ({
    ...i,
    roles: i.roles?.map(id => getRoleList({ id })[0]),
    password: '',
  }))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getUserList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(pageSize)),
    total: data.length,
  }
})
