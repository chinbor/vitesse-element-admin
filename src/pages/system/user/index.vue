<script setup lang="tsx" name="user">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { Row } from './api'
import { drop, getUserList, put } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<Row>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Row>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '账号', field: 'username', value: '' },
    { headerName: '姓名', field: 'nickname', value: '' },
    { headerName: '状态', field: 'state', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <ElSwitch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, state: props.params.value ? 0 : 1 })
            ElMessage.success('操作成功')
            getList()
          } }
          active-value={0}
          inactive-value={1}
        />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props) {
      const { params } = $(toRefs(props))
      return () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = params.data
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
        </div>
    } } },
  ],
  getUserList,
)

async function onDrop(list: Row[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { state: 0 }
}
</script>

<template>
  <div flex="~ col nowrap" bg="zinc-100 dark:zinc-800">
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div m-3 p-3 pb-2 bg="white dark:zinc-900" shadow rounded flex="~ 1 col" gap-2>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
name: user
meta:
  permission: /get/user
  title: 用户管理
  order: 1
</route>
