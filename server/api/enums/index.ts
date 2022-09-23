import { getEnumGroupList } from '../enum-groups'

export const list = [
  { id: '0', name: '工作证照片', description: '', index: 0, status: true, group: '0' },
  { id: '1', name: '普通照片', description: '', index: 1, status: true, group: '0' },
]

export const getEnumList = ({ order = 'index', sort = 'asc', ...query }) => list.slice()
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])
  .map(i => ({
    ...i,
    group: getEnumGroupList({ id: i.group })[0],
  }))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getEnumList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)),
    total: data.length,
  }
})
