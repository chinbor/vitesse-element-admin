export const list = [
  { id: '0', name: '政策法规', description: '', index: 0, status: true },
]

export const getBlogList = ({ order = 'index', sort = 'asc', ...query }) => list.slice()
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getBlogList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(pageSize)),
    total: data.length,
  }
})
