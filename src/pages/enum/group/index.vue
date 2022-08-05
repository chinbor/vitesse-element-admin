<script setup lang="tsx" name="enum-group">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { type EnumGroup, drop, getEnumGroupList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
const { agGridBind, agGridOn, selectedList, getList, list, row } = useAgGrid<EnumGroup>(
  [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '描述', field: 'description', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/enum-groups/[id]/put')} model-value={params.value}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: !params.value })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, unCheck: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: ({ params }) => () =>
      <div className="flex justify-between">
        <button v-permission="/enum-groups/[id]/put" className="i-fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          row.value = params.data
        }}/>
        <button v-permission="/enum-groups/[id]/delete" className="i-fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
      </div>,
    } },
  ],
  getEnumGroupList,
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
  }
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
      <el-button v-permission="'/enum-groups/post'" class="!ml-auto" type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <AgGridVue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/enum-groups/[id]/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop()">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 代码组
  permission:
    - title: 列表
      permission: /enum-groups
    - title: 添加
      permission: /enum-groups/post
    - title: 修改
      permission: /enum-groups/[id]/put
    - title: 删除
      permission: /enum-groups/[id]/delete
</route>
