export const list = [
  { id: '1', name: '市场部', remark: '', parentId: '' },
]

export default defineEventHandler((event) => {
  const { pageIndex = '1', pageSize = '50', parentId = '', ...query } = useQuery(event)

  return {
    data: list.slice((Number(pageIndex) - 1) * Number(pageSize), Number(pageSize))
      .filter(i => i.parentId === parentId)
      .reduce((a, b) => Object.keys(query).filter(key => !!Reflect.has(list[0], key)).find(key => !(`${b[key]}`).includes(<string>query[key])) ? a : [...a, b], [])
      .map(i => ({
        ...i,
        parent: list.find(item => item.id === i.parentId),
        hasChildren: !!list.find(item => item.parentId === i.id) }
      )),
    total: list.length,
  }
})
