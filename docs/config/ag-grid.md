# 表格设置
作为一个后台管理系统，最重要的莫过于展示数据的表格了，所以本项目使用了专业的`ag-grid`表格，提供了虚拟滚动，自动调整列宽度...等功能。
- `ag-grid`文档地址: https://www.ag-grid.com/vue-data-grid
## useAgGrid
`ag-grid` API的封装，你可以通过简单的配置实现搜索，排序，分页 并持久化到 `url`。
> 代码地址 [~/composables/agGrid](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/composables/agGrid.ts)
- 类型
``` ts
// ag-grid提供的列配置: https://www.ag-grid.com/vue-data-grid/grid-options
import type { ColDef } from 'ag-grid-community'

type ColumnDef<T = object> = Overwrite<ColDef, {
  field: Exclude<keyof T | 'select' | 'actions', number | symbol>
  value?: string
  suppressHide?: boolean
  hide?: boolean
  colId?: string
  options?: ((rest: Record<string, any>) => Promise<{ data: any[]; total: number }>) | any
  form?: {
    type?: 'input' | 'select' | 'switch' | 'radio' | 'checkbox' | 'date'
    width?: string
    props?: any
    optionLabel?: string
    optionValue?: string
  }
  valueGetter?: ((params: Overwrite<ValueGetterParams, { data: T }>) => any) | string
  cellRenderer?: { setup: ({ params }: { params: Params<T> }) => any }
}>

type useAgGrid<T=any> = (
  columnDefs: Column<T>[],
  fetchList: (rest: any) => Promise<{
    data: T[]
    total: number
  }>,
  defaultColDef?: ColDef,
) => void
```

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
默认和 `field` 属性设置一样，代表排序时传给后台的字段名

## sortIndex
- **类型:** `sortIndex?: number`
如果默认排序多于一列，可以指定排序的顺序。


