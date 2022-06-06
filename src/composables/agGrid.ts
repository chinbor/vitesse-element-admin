import type { LocationQueryValue } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { omit, pick } from 'lodash/fp'
import type { ColDef, ColumnApi, ColumnPinnedEvent, ColumnState, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import TableSet from '~/components/TableSet.vue'
import { isDark } from '~/composables'

interface Option { label?: string; value?: string | number }
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
  type Params<T> = Overwrite<ICellRendererParams, { data: T ; colDef: ColDef }>
export type Column<T = object> = Overwrite<ColDef, {
  value?: string
  field: keyof T | 'select' | 'actions'
  unCheck?: boolean
  hide?: boolean
  order?: string
  options?: ((rest: Record<string, any>) => Promise<{ data: Option[]; total: number }>) | Option[]
  form?: {
    type?: 'switch' | 'radio' | 'checkbox' | 'date' | 'input' | 'select' | 'textarea'
    width?: string
    props?: any
  }
  valueGetter?: ((params: Overwrite<ValueGetterParams, { data: T }>) => any) | string
  cellRenderer?: { setup: ({ params }: { params: Params<T> }) => any }
}>

export const useAgGrid = function <T=any>(
  getColumnList: () => Column<T>[],
  fetchList: (rest: any) => Promise<{
    data: T[]
    total: number
  }>,
  defaultColDef?: ColDef,
) {
  const router = useRouter()
  const route = useRoute()
  const name = route.name as string | undefined
  provide('getColumnList', getColumnList)
  const columnList = reactive(getColumnList())
  provide('columnList', columnList)
  const gridApi = shallowRef<GridApi>()
  provide('gridApi', gridApi)
  const columnApi = shallowRef<ColumnApi>()
  provide('columnApi', columnApi)
  const selectedList = ref<T[]>([])
  provide('selectedList', selectedList)
  const list = ref<T[]>([])
  provide('list', list)
  const total = ref(0)
  provide('total', total)

  const params = computed(() => columnList.reduce((a: any, b) => {
    if ((<string>b.field).includes(','))
      (<string>b.field).split(',').forEach((v, i) => a[v] = b.value?.[i])
    else
      a[b.field] = b.value || undefined
    return a
  }, {}))

  async function getList(data?: any) {
    gridApi.value?.showLoadingOverlay?.()
    router.replace({ query: { ...route.query, ...params.value } })
    const { pageIndex = '1', pageSize = '50', order, sort } = route.query
    const result = await fetchList({ pageIndex, pageSize, order, sort, ...params.value, ...data }).finally(() => gridApi.value?.hideOverlay?.())
    list.value = (result?.data ?? []) as any
    total.value = result?.total ?? 0
    selectedList.value = []

    await nextTick()
    autoSizeAll()
    gridApi.value?.refreshCells({ force: true })
  }
  provide('getList', getList)
  provide('selectAll', () => gridApi.value?.selectAll())
  provide('deselectAll', () => gridApi.value?.deselectAll())

  const initMap = pick(['unCheck', 'field', 'hide', 'pinned'])
  const initColumnList = columnList.map(initMap)
  const columnStore = useStorage(`${String(name)}`, initColumnList)
  const columnStoreOrigin = useStorage(`_${String(name)}`, initColumnList)
  if (!columnStore.value || JSON.stringify(initColumnList) !== JSON.stringify(columnStoreOrigin.value))
    columnStoreOrigin.value = columnStore.value = initColumnList

  function initStorage() {
    columnStore.value = reactive(getColumnList()).map(initMap)
    gridApi.value?.setColumnDefs([])
    gridApi.value?.setColumnDefs(getColumnDefs())
    autoSizeAll()
  }
  provide('initStorage', initStorage)

  provide('columnStore', columnStore)
  function getColumnDefs() {
    // 设置默认排序
    const order = (<LocationQueryValue>route.query.order)?.split(',')
    const sort = (<LocationQueryValue>route.query.sort)?.split(',')
    return columnStore.value.map((i, index) => {
      const option = columnList.find(item => item.field === i.field)!
      order?.forEach((o, index) => {
        if (option?.field === o)
          option.sort = sort?.[index] as 'asc' | 'desc'
      })

      if (index === columnStore.value.length - 1)
        option.headerComponent = TableSet

      return Object.assign(option, { ...i, hide: !!i.hide })
    }) as ColDef[]
  }
  provide('getColumnDefs', getColumnDefs)

  /** 自适应最大列宽度 */
  async function autoSizeAll() {
    if (!columnApi.value)
      return
    // 防止离开页面时触发 宽度自适应
    if (route.name !== name)
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
  provide('autoSizeAll', autoSizeAll)

  const agGridBind = reactive<GridOptions & { class: any }>({
    // rowBuffer: 1,
    rowData: list as any,
    class: computed(() => `flex-1 ag-theme-alpine${isDark.value ? '-dark' : ''}`),
    animateRows: true,
    rowSelection: 'multiple',
    suppressDragLeaveHidesColumns: true,
    suppressColumnVirtualisation: true,
    enableCellTextSelection: true,
    alwaysMultiSort: true,
    // enableCellChangeFlash: true,
    getRowId: ({ data }) => data?.id,
    defaultColDef: {
      sortable: true,
      resizable: true,
      comparator: () => 0,
      ...defaultColDef,
    },
    context: {
      initStorage,
      columnApi,
      autoSizeAll,
      columnStore,
    },
  })

  const agGridOn = {
    /** table 渲染到document事件 */
    async gridReady(params: GridReadyEvent) {
      gridApi.value = params.api
      columnApi.value = params.columnApi
      gridApi.value?.setColumnDefs(getColumnDefs())
      getList()
    },
    /** 浏览器窗口大小改变时 自动计算列宽度 */
    gridSizeChanged: autoSizeAll,
    /** 排序 */
    async sortChanged() {
      const model = columnApi.value?.getColumnState()
        .reduce((a: ColumnState[], b) => (b.sort && a.push(b), a), [])
        .sort((a, b) => a.sortIndex! - b.sortIndex!)

      const query = model?.length
        ? { order: model.map(i => i.colId).join(','), sort: model.map(i => i.sort).join(',') }
        : omit(['order', 'sort'], route.query)
      await router.replace({ query })
      getList()
    },
    /** 固定列事件 */
    columnPinned({ column, pinned }: ColumnPinnedEvent) {
      const item = columnStore.value.find(i => column?.getColId() === i.field)
      if (item)
        item.pinned = pinned
    },
    /** 拖动列事件 */
    columnMoved: (): void => {
      if (!columnApi.value)
        return
      columnStore.value = columnApi.value.getAllGridColumns().map((i) => {
        const { unCheck, field } = columnList.find(column => column.field === i.getColId())!
        return { unCheck, field, hide: !i.isVisible(), pinned: i.getPinned() }
      })
    },
    /** 数据改变时 自动计算列宽度 */
    rowDataChanged: autoSizeAll,
    /** select 事件 */
    selectionChanged: () => {
      if (!gridApi.value)
        return
      selectedList.value = gridApi.value.getSelectedRows()
    },
  }

  return {
    columnList,
    selectedList,
    gridApi,
    columnApi,
    params,
    getList,
    list,
    total,
    agGridBind,
    agGridOn,
  }
}
