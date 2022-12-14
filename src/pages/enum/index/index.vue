<script setup lang="tsx" name="enum-index">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { getEnumGroupList } from '../group/api'
import { type Enum, drop, getEnumList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
const { agGridProps, agGridEvents, columnList, selectedList, getList, row, list } = useAgGrid<Enum>(
  [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', suppressHide: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '代码组', field: 'group', valueGetter: ({ data }) => data.group?.name, value: '', options: (name, params) =>
      getEnumGroupList({ name, params }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.name, value: i.id })),
        total,
      })),
    },
    { headerName: '描述', field: 'description', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', filterType: 'switch', cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch
        disabled={!user.hasPermission('/enums/[id]/put')}
        model-value={params.value}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: !params.value })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, suppressHide: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: ({ params }) => () =>
      <div className="flex justify-between">
        <button v-permission="/enums/[id]/put" className="i-fa6-solid:pen-to-square btn"
          onClick={() => {
            show = true
            row.value = params.data
          }}
        />
        <button v-permission="/enums/[id]/delete" className="i-fa6-solid:trash-can btn"
          onClick={() => onDrop([params.data])}
        />
      </div>,
    } },
  ],
  getEnumList,
)

async function onDrop(list = selectedList.value) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row.value = {
    status: true,
    group: { id: columnList.find(i => i.field === 'group')?.value },
  } as Enum
}

function rowDragEnd({ node, overIndex }: any) {
  Promise.all([
    put({ id: node.data.id, index: list.value[overIndex].index }),
    put({ id: list.value[overIndex].id, index: node.data.index }),
  ]).then(() => getList())
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button v-permission="'/enums/post'" type="primary" @click="addHandler">
        <i i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <AgGridVue v-bind="agGridProps" v-on="agGridEvents" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/enums/[id]/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop()">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 全局代码
  permission:
    - title: 列表
      permission: /enums
    - title: 添加
      permission: /enums/post
    - title: 修改
      permission: /enums/[id]/put
    - title: 删除
      permission: /enums/[id]/delete
</route>
