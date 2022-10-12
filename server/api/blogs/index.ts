import { dayjs } from 'element-plus'

export const list = Array.from({ length: 999 }).map((_, index) => (
  {
    index: index + 1,
    id: `${index + 1}`,
    name: `政策法规${index + 1}`,
    description: '根据列内容自适应列宽度',
    description1: '根据列内容自适应列宽度|根据列内容自适应列宽度',
    description2: '根据列内容自适应列宽度|根据列内容自适应列宽度|根据列内容自适应列宽度',
    createTime: dayjs().format('YYYY-MM-DD'),
    status: true,
  }
))

export const getBlogList = ({ order = 'index', sort = 'asc', ...query }) => list.slice()
  .filter(i => !Object.keys(query).find(key => !`${i[key]}`.includes(query[key])))
  .sort((a, b) => sort === 'asc' ? a[order] - b[order] : b[order] - a[order])

export default defineEventHandler((event) => {
  const { page = '1', pageSize = '50', ...query } = useQuery(event)
  const data = getBlogList(query)

  return {
    data: data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)),
    total: data.length,
  }
})
