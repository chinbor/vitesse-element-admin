<script setup lang="tsx" name="system-role">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Role } from './api'
import { drop, getRoleList } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
const router = useRouter()
const { agGridBind, agGridOn, selectedList, getList, row } = useAgGrid<Role>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '', cellRenderer: { setup: ({ params }) => () =>
      <a v-permission_disabled="/role/id/permission" className="text-primary hover:opacity-70 cursor-pointer" onClick={() => router.push({ name: 'system-role-id', params: { id: params.data.id }, query: { headerTitle: params.value } })}>{params.value}</a>,
    } },
    { headerName: '描述', field: 'remark', value: '' },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex items-center justify-between">
        <button v-permission="/role/id/put" className="fa6-solid:pen-to-square btn" onClick={() => {
          show = true
        }}/>
        <button v-permission="/role/id/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
      </div>,
    } },
  ],
  getRoleList,
)

async function onDrop(list: Role[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row.value = {}
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button v-permission="'/role/post'" class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button v-permission="'/role/id/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
