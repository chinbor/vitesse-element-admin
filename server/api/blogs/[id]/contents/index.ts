import { getBlogList } from '../..'

export const list = [
  { id: '0', title: '《中华人民共和国建筑法》', content: '', blog: '0', index: 0, status: true },
]

export const getBlogContentList = ({ order = 'index', sort = 'asc', ...query }) => list.slice()
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])
  .map(i => ({
    ...i,
    blog: getBlogList({ id: i.blog })[0],
  }))

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getBlogContentList({ ...query, blog: event.context.params.id })

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)),
    total: data.length,
  }
})
