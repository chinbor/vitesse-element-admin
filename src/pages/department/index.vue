<script setup lang="tsx" name="department">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { Department } from './api'
import { drop, getDepartmentList, put } from './api'
import VForm from './components/VForm.vue'
import DepartmentTree from './components/DepartmentTree.vue'

let show = $ref(false)
let treeKey = $ref(0)
const treeRef = $ref<{ department?: Department }>()
let departmentId = $(useRouteQuery<string>('departmentId'))
const { agGridProps, agGridEvents, selectedList, getList, list, row } = useAgGrid<Department>(
  [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: ({ node }) => departmentId ? !!node.rowIndex : true, lockPosition: 'left', pinned: 'left', valueGetter: '', suppressHide: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '', cellRenderer: { setup: ({ params }) => () =>
      <span
        onClick={() => (departmentId = params.data[!params.rowIndex && departmentId ? 'parentId' : 'id']!)}
        className={`flex-inline items-center cursor-pointer gap-1.5 hover:text-primary ${departmentId && params.rowIndex ? 'ml-11' : ''}`}
      >
        {!params.rowIndex && departmentId
          ? <i className={`text-gray-400 i-bx-bxs-down-arrow ${params.data?.hasChildren ? '' : 'hidden'}`} />
          : params.data.hasChildren
            ? <i className={`text-gray-400 i-bx-bxs-right-arrow ${departmentId ? '-ml-6' : ''}`} />
            : null}
        <span>{params.data?.name}</span>
      </span>,
    } },
    { headerName: '描述', field: 'remark', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', filterType: 'switch', cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch
        disabled={!user.hasPermission('/departments/[id]/put')}
        model-value={params.value}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: !params.value })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', suppressHide: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex justify-between">
        <button v-permission="/departments/[id]/put" className="i-fa6-solid:pen-to-square btn"
          onClick={() => {
            show = true
            row.value = props.params.data
          }}
        />
        <button v-permission="/departments/[id]/delete" className="i-fa6-solid:trash-can btn"
          onClick={() => onDrop([props.params.data]) }
        />
      </div>,
    } },
  ],
  async (params) => {
    if (!treeRef.department)
      return { data: [], total: 0 }
    if (treeRef.department?.hasChildren) {
      const { data, total } = await getDepartmentList({ ...params, parentId: departmentId })
      return { data: departmentId ? [treeRef.department, ...data] : data, total }
    }
    return { data: treeRef.department?.id ? [treeRef.department] : [], total: 0 }
  },
)

async function onDrop(list: any[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  departmentId = list[0].parentId
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
  treeKey++
}

function addHandler() {
  show = true
  row.value = {
    parentId: departmentId,
    status: true,
  }
}

function rowDragEnd({ node, overIndex }: any) {
  if (!overIndex)
    return getList()
  Promise.all([
    put({ id: node.data.id, index: list.value[overIndex].index }),
    put({ id: list.value[overIndex].id, index: node.data.index }),
  ]).then(() => { getList(); treeKey++ })
}

watch(() => treeRef?.department?.id, () => {
  getList()
})
</script>

<template>
  <div layout>
    <VHeader>
      <el-button v-permission="'/departments/post'" type="primary" @click="addHandler">
        <i i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div flex="~ 1" gap-3 m-3 overflow-hidden>
      <DepartmentTree ref="treeRef" :key="treeKey" v-model:departmentId="departmentId" />

      <div main m-0>
        <VFilter />
        <AgGridVue v-bind="{ ...agGridProps, getRowId: undefined }" v-on="{ ...agGridEvents, rowDragEnd }" />
        <Pagination>
          <el-button v-permission="'/departments/[id]/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
            删除
          </el-button>
        </Pagination>
      </div>
    </div>

    <VForm
      v-if="show"
      v-model="show"
      v-model:treeKey="treeKey"
      :row="row"
      :parent-id="departmentId"
    />
  </div>
</template>

<route lang="yaml">
meta:
  title: 部门管理
  permission:
    - title: 列表
      permission: /departments
    - title: 添加
      permission: /departments/post
    - title: 修改
      permission: /departments/[id]/put
    - title: 删除
      permission: /departments/[id]/delete
</route>
