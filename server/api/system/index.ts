export const systemList = [
  { id: '1', prop: 'name', label: '系统名称', type: 'input', value: '后台管理系统' },
  { id: '2', prop: 'description', label: '系统描述', type: 'input', value: 'Vitesse Background Management System' },
  { id: '3', prop: 'logo', label: 'Logo', type: 'input', value: '/logo.png', description: '系统图标' },
  { id: '4', prop: 'pageSize', label: '默认分页', type: 'select', value: 50, options: [{ label: 10, value: '10' }, { label: 50, value: 50 }, { label: 100, value: 100 }, { label: 200, value: 200 }] },
]

export default defineEventHandler((event) => {
  const { pageIndex = '1', rows = '50' } = useQuery(event)
  return {
    data: systemList.slice((Number(pageIndex) - 1) * Number(rows), Number(rows)),
    total: systemList.length,
  }
})
