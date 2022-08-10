import type { LocationQueryValue } from 'vue-router'
import type { ColDef, ColumnApi, ColumnPinnedEvent, ColumnState, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowClickedEvent, ValueGetterParams } from 'ag-grid-community'
import TableSet from '~/components/TableSet.vue'

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
  type Params<T> = Overwrite<ICellRendererParams, { data: T ; colDef: ColDef }>
export type Column<T = object> = Overwrite<ColDef, {
  value?: string
  field: Exclude<keyof T | 'select' | 'actions', number | symbol>
  unCheck?: boolean
  hide?: boolean
  order?: string
  options?: ((rest: Record<string, any>) => Promise<{ data: any[]; total: number }>) | any
  form?: {
    type?: 'switch' | 'radio' | 'checkbox' | 'date' | 'input' | 'select' | 'textarea'
    width?: string
    props?: any
    optionLabel?: string
    optionValue?: string
  }
  valueGetter?: ((params: Overwrite<ValueGetterParams, { data: T }>) => any) | string
  cellRenderer?: { setup: ({ params }: { params: Params<T> }) => any }
}>

export const useAgGrid = function <T=any>(
  columnDefs: Column<T>[],
  fetchList: (rest: any) => Promise<{
    data: T[]
    total: number
  }>,
  defaultColDef?: ColDef,
) {
  const router = useRouter()
  const route = useRoute()
  const name = route.name as string
  const columnList = reactive(columnDefs)
  const gridApi = shallowRef<GridApi>()
  const columnApi = shallowRef<ColumnApi>()
  const row = ref({} as T)
  const selectedList = ref<T[]>([])
  const list = ref<T[]>([])
  const total = ref(0)

  const defaultValue = columnList.reduce((a: any, b) => (b.value && (a[b.field] = b.value), a), {})
  const params = $computed(() => columnList.reduce((a: any, b) => {
    // 根据后台API需求生成请求参数
    if (b.field.includes(','))
      b.field.split(',').forEach((v, index) => a.value[v] = (<string>route.query?.[b.field])?.split(',')[index] || b.value?.split(',')[index])
    else
      a.value[b.field] = b.value?.includes(',') ? b.value.split(',') : b.value || undefined
    // 生成 $route.query
    a.query[b.field] = defaultValue[b.field] === b.value ? undefined : b.value || undefined
    return a
  }, { value: {}, query: {} }))

  async function getList(data?: any) {
    gridApi.value?.showLoadingOverlay?.()
    router.replace({ query: { ...route.query, ...params.query } })
    const { page = '1', pageSize = '50', order, sort } = route.query
    const result = await fetchList({ page, pageSize, order, sort, ...params.value, ...data }).finally(() => gridApi.value?.hideOverlay?.())
    list.value = (result?.data ?? []) as any
    total.value = result?.total ?? 0
    selectedList.value = gridApi.value!.getSelectedRows()
    row.value = {} as any

    autoSizeAll()
  }

  const initColumnList = columnList.map(i => ({
    field: i.field,
    hide: !!i.hide,
    unCheck: !!i.unCheck,
    pinned: i.pinned,
  }))
  const columnStoreList = useLocalStorage(name, initColumnList)
  const columnStoreListOrigin = useLocalStorage(`_${name}`, initColumnList)
  if (!columnStoreList.value || JSON.stringify(initColumnList) !== JSON.stringify(columnStoreListOrigin.value))
    columnStoreListOrigin.value = columnStoreList.value = initColumnList

  async function initStorage() {
    columnStoreList.value = initColumnList
    gridApi.value?.setColumnDefs([])
    gridApi.value?.setColumnDefs(getColumnDefs())
    autoSizeAll()
  }

  function getColumnDefs() {
    // 设置默认排序
    const order = (<LocationQueryValue>route.query.order)?.split(',')
    const sort = (<LocationQueryValue>route.query.sort)?.split(',')
    const lastField = columnStoreList.value.filter(i => !i.hide).at(-1)?.field
    return columnStoreList.value.map((column) => {
      const option = columnList.find(item => item.field === column.field)!
      order?.forEach((o, index) => {
        if (option?.field === o)
          option.sort = sort?.[index] as 'asc' | 'desc'
      })

      // 给最后一列添加设置组件
      if (column.field === lastField && !option.headerComponent)
        option.headerComponent = TableSet

      return Object.assign(option, column)
    }) as ColDef[]
  }

  /** 自适应最大列宽度 */
  async function autoSizeAll() {
    await nextTick()
    // 防止离开页面时触发 宽度自适应
    if (!columnApi.value || route.name !== name)
      return

    columnApi.value.autoSizeAllColumns(false)

    // @ts-expect-error 计算完宽度后 如果有空白就自动填充空白
    const width = gridApi.value?.gridBodyCtrl.eBodyViewport.scrollWidth
      - columnApi.value
        .getAllDisplayedColumns()
        .map(i => i.getActualWidth())
        .reduce((a, b) => a + b, 0)
    if (width <= 0)
      return

    columnApi.value.getAllDisplayedColumns().filter(i =>
      !i.getColDef().maxWidth && !i.getColDef().suppressSizeToFit,
    ).forEach((i, _, list) => {
      columnApi.value?.setColumnWidth(i, i.getActualWidth() + width / list.length)
    })
  }

  const agGridBind = reactive<GridOptions & { class: any }>({
    rowData: list as any,
    class: computed(() => `flex-1 ag-theme-alpine${isDark.value ? '-dark' : ''}`),
    animateRows: true,
    rowSelection: 'multiple',
    suppressDragLeaveHidesColumns: true,
    suppressColumnVirtualisation: true,
    enableCellTextSelection: true,
    alwaysMultiSort: true,
    enableCellChangeFlash: true,
    rowDragManaged: true,
    getRowId: ({ data }) => data?.id,
    defaultColDef: {
      sortable: true,
      resizable: true,
      ...defaultColDef,
    },
    context: {
      initStorage,
      autoSizeAll,
      columnStoreList,
    },
  })

  const agGridOn = {
    async gridReady(params: GridReadyEvent) {
      gridApi.value = params.api
      columnApi.value = params.columnApi
      gridApi.value.setColumnDefs(getColumnDefs())
      getList()
    },
    async sortChanged() {
      const model = columnApi.value!.getColumnState()
        .reduce((a: ColumnState[], b) => (b.sort && a.push(b), a), [])
        .sort((a, b) => a.sortIndex! - b.sortIndex!)
      await router.replace({ query: {
        ...route.query,
        order: model.map(i => i.colId).join(',') || undefined,
        sort: model.map(i => i.sort).join(',') || undefined,
      } })
      getList()
    },
    columnPinned({ column, pinned }: ColumnPinnedEvent) {
      const item = columnStoreList.value.find(i => column?.getColId() === i.field)
      item && (item.pinned = pinned as any)
    },
    columnMoved() {
      columnStoreList.value = columnApi.value!.getAllGridColumns().map(i => ({
        ...initColumnList.find(column => column.field === i.getColId())!,
        hide: !i.isVisible(),
      }))
    },
    selectionChanged() {
      selectedList.value = gridApi.value!.getSelectedRows()
    },
    rowClicked({ data }: RowClickedEvent) {
      row.value = data
    },
    /** 浏览器窗口大小改变时 自动计算列宽度 */
    gridSizeChanged: autoSizeAll,
  }

  provide('list', list)
  provide('total', total)
  provide('getList', getList)
  provide('getColumnDefs', getColumnDefs)
  provide('selectedList', selectedList)
  provide('selectAll', () => gridApi.value?.selectAll())
  provide('deselectAll', () => gridApi.value?.deselectAll())

  return {
    columnList,
    selectedList,
    gridApi,
    columnApi,
    params: computed(() => params.value),
    getList,
    list,
    row,
    total,
    agGridBind,
    agGridOn,
  }
}
