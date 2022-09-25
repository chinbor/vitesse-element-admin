import type { ColDef, ColumnApi, ColumnPinnedEvent, ColumnState, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowClickedEvent, ValueGetterParams } from 'ag-grid-community'
import type { ComputedRef, UnwrapRef } from 'vue'
import { isEqual } from 'lodash-es'
import TableSet from '~/components/TableSet.vue'

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
  type Params<T> = Overwrite<ICellRendererParams, { data: T ; colDef: ColDef }>

type Option = { label?: string; value?: any } & Record<string, any>
export type ColumnDef<T = object> = Overwrite<ColDef, {
  field: Exclude<keyof T | 'select' | 'actions', number | symbol>
  value?: string
  suppressHide?: boolean
  options?: ((_: any & { name?: string }) => Promise<{
    data: Option[]
    total: number
  }>) | Option[]
  form?: {
    type?: 'switch' | 'radio' | 'checkbox' | 'date'
    props?: any
    optionLabel?: string
    optionValue?: string
  }
  valueGetter?: ((params: Overwrite<ValueGetterParams, { data: T }>) => any) | string
  cellRenderer?: { setup: ({ params }: { params: Params<T> }) => any }
}>

export function useAgGrid <T=any>(
  columnDefList: ColumnDef<T>[],
  fetchList: (rest: any) => Promise<{
    data: UnwrapRef<T[]>
    total: number
  }>,
  defaultColDef?: ColDef,
) {
  const router = useRouter()
  const route = useRoute()
  const name = route.name as string
  const columnList = reactive(columnDefList)
  const gridApi = shallowRef<GridApi>()
  const columnApi = shallowRef<ColumnApi>()
  const row = ref({} as T)
  const selectedList = ref<T[]>([])
  const list = ref<T[]>([])
  const total = ref(0)

  let sortParams = $ref<{ order?: string; sort?: string }>({ })
  function getSortParams() {
    const model = columnApi.value!.getColumnState()
      .reduce((a: ColumnState[], b) => (b.sort && a.push(b), a), [])
      .sort((a, b) => a.sortIndex! - b.sortIndex!)
    return {
      order: model.map(i => i.colId).join(',') || undefined,
      sort: model.map(i => i.sort).join(',') || undefined,
    }
  }

  const defaultValue = columnList.reduce((a: any, b) => (b.value && (a[b.field] = b.value), a), {})
  const params = $computed(() =>
    columnList.reduce(({ value, query }: any, column) => {
      // Customize the parameters passed to the background
      if (column.field.includes(','))
        column.field.split(',').forEach((v, index) => value[v] = (<string>route.query?.[column.field])?.split(',')[index] || column.value?.split(',')[index])
      else
        value[column.field] = column.value?.includes?.(',') ? column.value.split(',') : column.value || undefined

      // Generate $route.query
      query[column.field] = defaultValue[column.field] === column.value ? undefined : column.value || undefined
      return { value, query }
    }, {
      value: { ...sortParams },
      query: { ...sortParams },
    }),
  )

  async function getList(data?: any) {
    gridApi.value?.showLoadingOverlay()
    await router.replace({ query: { ...route.query, ...params.query } })
    const { page = '1', pageSize = settings.pageSize } = route.query
    const result = await fetchList({ page, pageSize, ...params.value, ...data })
      .finally(() => gridApi.value?.hideOverlay())
    list.value = result?.data ?? []
    total.value = result?.total ?? 0
    selectedList.value = gridApi.value!.getSelectedRows()
    row.value = {} as any

    autoSizeAll()
  }

  // When the fields in the initColumnList change, the old Settings in the localStorage are automatically updated
  const initColumnList = columnList.map(i => ({
    field: i.field,
    colId: i.colId,
    sort: i.sort || null,
    sortIndex: i.sortIndex,
    hide: !!i.hide,
    suppressHide: !!i.suppressHide,
    pinned: i.pinned,
  }))
  const columnStoreList = useLocalStorage(name, initColumnList)
  const _columnStoreList = useLocalStorage(`_${name}`, initColumnList)
  if (!isEqual(_columnStoreList.value, initColumnList))
    columnStoreList.value = _columnStoreList.value = initColumnList.map(i => ({ ...i }))

  const columnDefs = computed(() => {
    // Set the default sort
    const order = (<string>route.query.order)?.split(',')
    const sort = (<string>route.query.sort)?.split(',') as ('asc' | 'desc')[]
    const lastField = columnStoreList.value.filter(i => !i.hide).at(-1)?.field
    return columnStoreList.value.map((column) => {
      if (order) {
        const index = order.findIndex(field => field === column.field)
        column.sort = index >= 0 ? sort?.[index] : null
        column.sortIndex = index >= 0 ? index : undefined
      }
      const option = columnList.find(item => item.field === column.field)!
      // Add the Settings component to the last column
      if (column.field === lastField && !option.headerComponent)
        option.headerComponent = TableSet

      return Object.assign(option, column)
    }) as ColDef[]
  })

  async function initStorage() {
    await router.replace({ query: { ...route.query, sort: undefined, order: undefined } })
    columnStoreList.value = initColumnList.map(i => ({ ...i }))
    gridApi.value?.setColumnDefs(columnDefs.value)
    getList()
  }

  // Adaptive column width
  async function autoSizeAll() {
    await nextTick()
    // Prevents triggering when leaving the page
    if (!columnApi.value || route.name !== name)
      return

    columnApi.value.autoSizeAllColumns(false)

    // @ts-expect-error After calculating the width, if the excess width is filled automatically
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

  const agGridProps = reactive<GridOptions & { class: ComputedRef<string> }>({
    rowData: list as any,
    class: computed(() => `flex-1 ag-theme-alpine${isDark.value ? '-dark' : ''}`),
    animateRows: true,
    rowSelection: 'multiple',
    suppressDragLeaveHidesColumns: true,
    suppressColumnVirtualisation: true,
    enableCellTextSelection: true,
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

  const agGridEvents = {
    async gridReady(params: GridReadyEvent) {
      gridApi.value = params.api
      columnApi.value = params.columnApi
      gridApi.value.setColumnDefs(columnDefs.value)
      sortParams = getSortParams()
      getList()
    },
    sortChanged: () => {
      sortParams = getSortParams()
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
    /** Column widths are computed automatically when the table size changes */
    gridSizeChanged: autoSizeAll,
  }

  provide('list', list)
  provide('total', total)
  provide('getList', getList)
  provide('columnDefs', columnDefs)
  provide('selectedList', selectedList)
  provide('selectAll', () => gridApi.value?.selectAll())
  provide('deselectAll', () => gridApi.value?.deselectAll())

  return {
    row,
    list,
    total,
    params: computed(() => params.value),
    columnList,
    selectedList,
    getList,
    agGridProps,
    agGridEvents,
    gridApi,
    columnApi,
  }
}
