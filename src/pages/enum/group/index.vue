<script setup lang="tsx" name="enum/group">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { type EnumGroup, drop, getEnumGroupList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
let id = $ref('')
const { agGridBind, agGridOn, selectedList, getList, list } = useAgGrid<EnumGroup>(
  () => [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '描述', field: 'description', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/enum/group/id/put')} model-value={params.value}
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
        <button v-permission="/enum/group/id/put" className="fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          id = params.data.id!
        }}/>
        <button v-permission="/enum/group/id/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
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
  id = ''
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
      <el-button v-permission="'/enum/group/post'" class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/enum/group/id/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop()">
          删除
        </el-button>
      </Pagination>
    </div>

    <Suspense v-if="show">
      <VForm :id="id" v-model:show="show" />
      <template #fallback>
        <div v-loading.fullscreen="true" />
      </template>
    </Suspense>
  </div>
</template>

<route lang="yaml">
meta:
  title: 代码组
  permission:
    - title: 列表
      permission: /enum/group
    - title: 添加
      permission: /enum/group/post
    - title: 修改
      permission: /enum/group/id/put
    - title: 删除
      permission: /enum/group/id/delete
</route>