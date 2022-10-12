import { links } from '..'

export const list = Array(1000).fill('').map((_, index) => (
  { id: `${index + 1}`, name: `管理员${index || ''}`, status: true, index, permissions: links }
))

export const getRoleList = ({ order = 'index', sort = 'asc', ...query }) => list
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getRoleList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)),
    total: data.length,
  }
})
