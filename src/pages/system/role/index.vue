<script setup lang="tsx" name="system-role">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Role } from './api'
import { drop, getRoleList } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
let id = $ref<Role['id']>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Role>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '', cellRenderer: { setup: ({ params }) => () =>
      <router-link class="text-primary hover:opacity-70" to={{ name: 'system-role-id', params: { id: params.data.id } }}>{params.value}</router-link>,
    } },
    { headerName: '描述', field: 'remark', value: '' },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            id = props.params.data.id
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
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
  id = ''
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" :id="id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 角色管理
  order: 3
</route>
