<script setup lang="tsx" name="repairs-index">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRepairTypeList } from '../type/api'
import type { Repair } from './api'
import { drop, getRepairList, repairStatusList } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)

const { agGridBind, agGridOn, selectedList, getList, row } = useAgGrid<Repair>(
  () => [
    { headerName: '', field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'repairsContent', value: '' },
    { headerName: '类型', valueGetter: ({ data }) => data.classification?.name, field: 'classification.id', value: '', options: getRepairTypeList },
    { headerName: '联系人', field: 'contacts', value: '' },
    { headerName: '联系人电话', field: 'contactsPhone' },
    { headerName: '联系人部门', field: 'department' },
    { headerName: '处理人', field: 'handler', value: '' },
    { headerName: '处理人电话', field: 'handlerPhone' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, valueGetter: ({ data }) => repairStatusList.find(i => i.value === data.status)?.label, value: '', options: repairStatusList },
    { headerName: '处理结果', field: 'result' },
    { headerName: '操作', field: 'actions', unCheck: true, maxWidth: 68, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row.value = props.params.data
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>,
    } },
  ],
  getRepairList,
)

async function onDrop(list = selectedList.value) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}
</script>

<template>
  <div layout>
    <VHeader />

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" :id="row.id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 报修申请
</route>
