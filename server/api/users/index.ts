import { getDepartment } from '../departments/[id]'
import { getRoleList } from '../roles'

export const list = [
  { id: '0', username: 'admin', name: '管理员', password: 'password', email: '260480378@qq.com', sex: 1, status: true, index: 0, roles: ['0'], department: '' },
]

export const getUserList = ({ order = 'index', sort = 'asc', ...query }) => list
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])
  .map(i => ({
    ...i,
    roles: i.roles?.map(id => getRoleList({ id })[0]),
    department: getDepartment(i.department),
    password: '',
  }))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getUserList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)),
    total: data.length,
  }
})
