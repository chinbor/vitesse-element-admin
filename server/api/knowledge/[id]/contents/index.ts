import { getKnowledgeList } from '../..'

export const list = [
  { id: '0', title: '《中华人民共和国建筑法》', content: '', knowledge: '0', index: 0, status: true },
]

export const getKnowledgeContentList = ({ order = 'index', sort = 'asc', ...query }) => list.slice()
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])
  .map(i => ({
    ...i,
    knowledge: getKnowledgeList({ id: i.knowledge })[0],
  }))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getKnowledgeContentList({ ...query, knowledge: event.context.params.id })

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(pageSize)),
    total: data.length,
  }
})
