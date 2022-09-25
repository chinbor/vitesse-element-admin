export const list = [
  { id: '1', name: '市场部', remark: '', parentId: '', status: true },
]

export const getDepartmentList = (query, data = list) => data
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .map(i => ({
    ...i,
    parent: list.find(item => item.id === i.parentId),
    hasChildren: !!list.find(item => item.parentId === i.id),
  }))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', parentId = '', ...query } = useQuery(event)
  const data = getDepartmentList(query, list.filter(i => i.parentId === parentId))

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)),
    total: data.length,
  }
})
