# 表格设置
作为一个后台管理系统，最重要的莫过于展示数据的表格了，所以本项目使用了专业的`ag-grid`表格，提供了虚拟滚动，自动调整列宽度...等功能。
- `ag-grid`文档地址: https://www.ag-grid.com/vue-data-grid

## useAgGrid
`ag-grid` API的封装，你可以通过简单的配置实现搜索，排序，分页 并持久化到 `url`。
> 代码地址 [~/composables/agGrid](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/composables/agGrid.ts)
- **类型:**
``` ts
// ag-grid提供的列配置: https://www.ag-grid.com/vue-data-grid/column-options
import type { ColDef } from 'ag-grid-community'

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
  type Params<T> = Overwrite<ICellRendererParams, { data: T ; colDef: ColDef }>

interface Option { label: string; value: any }
type ColumnDef<T = object> = Overwrite<ColDef, {
  field: Exclude<keyof T | 'select' | 'actions', number | symbol>
  value?: string
  suppressHide?: boolean
  options?: ((_: object & { name?: string }) => Promise<{
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

type useAgGrid<T=any> = (
  columnDefs: ColumnDef<T>[],
  fetchList: (rest: any) => Promise<{
    data: T[]
    total: number
  }>,
  defaultColDef?: ColDef,
) => void
```

::: details 例子
<<< src/pages/blog/index.vue
:::

## field
- **类型:** `field: Exclude<keyof T | 'select' | 'actions', number | symbol>`

必填字符串属性，根据 `field` 来生成当前列的数据

## value
- **类型:** `value?: string`

传递给搜索组件的默认值, 如果没配置 则当前列无法搜索

## hide
- **类型:** `hide?: boolean`

默认为 `false`，设置为 `true` 则代表当前列默认被隐藏


## suppressHide
- **类型:** `suppressHide?: boolean`

默认为 `false`，设置为 `true` 则代表当前列不能被隐藏，例如操作列

## colId
- **类型:** `codId?: string`

默认和 `field` 属性设置一样，排序时传给后台的字段名

## sortIndex
- **类型:** `sortIndex?: number`

如果默认排序多于一列，可以指定排序的顺序
::: warning 多列排序
 默认需要按下shift + 鼠标左键点击，
设置 [alwaysMultiSort](https://www.ag-grid.com/vue-data-grid/grid-options/#reference-sort-alwaysMultiSort) 为`true` 则不需要按下shift键
:::

## options
- **类型:**
```ts
interface Option { label: string; value: any }
type Options = ((_: object & { name?: string }) => Promise<{
  data: Option[]
  total: number
}>) | Option[]
```
配置了options，代表当前搜索类型为`el-select`
- **数组:** `el-select`的选项列表 
- **方法:** `el-select`的远程搜索方法

### form.optionLabel
- **类型:** `string`

默认:`name`，用于指定`el-option`的**label**属性，和搜索时传给接口的参数名
### form.optionValue
- **类型:** `string`

默认:`id`，用于指定`el-option`的**value**属性

### form.type
- **类型:** `'switch' | 'radio' | 'checkbox' | 'date'`

如果配置了`value`字段，则搜索组件默认为`el-input`，如果配置了`options`属性 则默认为`el-select`，可以通过`form.type`配置为其他搜索组件

### form.props
- **类型:** `object`

自定义搜索组件的props

## valueGetter
::: details **类型:**
```ts
interface ValueGetterParams<TData = any> {
  // A utility method for getting other column values
  getValue: (field: string) => any
  // Row node for the given row
  node: RowNode<TData> | null
  // Data associated with the node
  data: TData | undefined
  // Column for this callback
  column: Column
  // ColDef provided for this column
  colDef: ColDef<TData>
  // The grid api.
  api: GridApi<TData>
  // The column api.
  columnApi: ColumnApi
  // Application context as set on `gridOptions.context`.
  context: any
}
interface ValueGetterFunc<TData = any> {
  (params: ValueGetterParams<TData>): any
}
type valueGetter = string | ValueGetterFunc<TData>
```
:::
格式化当前列的方法，例如:
``` js
const column = {
  headerName: '性别',
  field: 'sex',
  valueGetter: ({ data }) => data.sex === 1 ? '男' : '女'
}
```

## cellRenderer
- **类型:**
``` ts
interface cellRenderer {
  setup: ({ params }: { params: Params<T> }) => any
}
```
定义当前列的渲染组件，推荐使用jsx 例如:
``` tsx
const column = {
  headerName: '名称',
  field: 'name',
  cellRenderer: {
    setup: ({ params }) => () =>
      <route-link to={{ name: 'blog-id', params: { id: params.data.id } }}>
        {params.value}
      </route-link>,
  }
}
```

## suppressSizeToFit
- **类型:** `boolean`

如果表格`width`有多余空间，默认每个列平分剩余空间，设置为`true`则不会分配更多宽度


## 更多
更多设置请参考 https://www.ag-grid.com/vue-data-grid/column-properties/

