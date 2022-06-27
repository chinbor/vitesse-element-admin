<script setup lang="tsx" name="question-type">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { QuestionType } from './api'
import { drop, getQuestionTypeList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
const { agGridBind, agGridOn, selectedList, getList, list, row } = useAgGrid<QuestionType>(
  () => [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/sys/question/classification/edit')} model-value={params.value} active-value={1} inactive-value={0}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: params.value ? 0 : 1 })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, unCheck: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: ({ params }) => () =>
      <div className="flex justify-between">
        <button v-permission="/sys/question/classification/edit" className="fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          row.value = params.data
        }}/>
        <button v-permission="/sys/question/classification/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
      </div>,
    } },
  ],
  getQuestionTypeList,
)

async function onDrop(list: QuestionType[]) {
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

function rowDragEnd({ node, overIndex }: any) {
  Promise.all([
    put({ id: node.data.id, sort: list.value[overIndex].sort }),
    put({ id: list.value[overIndex].id, sort: node.data.sort }),
  ]).then(() => getList())
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button v-permission="'/sys/question/classification/add'" class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/sys/question/classification/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" :id="row.id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 问卷分类
  permission:
    - title: 列表
      permission: /sys/question/classification/list
    - title: 添加
      permission: /sys/question/classification/add
    - title: 修改
      permission: /sys/question/classification/edit
    - title: 删除
      permission: /sys/question/classification/delete
</route>
