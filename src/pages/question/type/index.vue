<script setup lang="tsx" name="question-type">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { QuestionType } from './api'
import { drop, getQuestionTypeList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
let id = $ref<QuestionType['id']>()

const { agGridBind, agGridOn, selectedList, getList, list } = useAgGrid<QuestionType>(
  () => [
    { field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true, headerValueGetter: ' ' },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <ElSwitch model-value={props.params.value} active-value={1} inactive-value={0}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: props.params.value ? 0 : 1 })
            ElMessage.success('操作成功')
            getList()
          } }
        />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, unCheck: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
        <div className="flex justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            id = props.params.data.id
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>,
    } },
  ],
  getQuestionTypeList,
)

async function onDrop(list: QuestionType[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  id = ''
}

async function rowDragEnd({ node, overIndex }: any) {
  await Promise.all([
    put({ ...node.data, sort: list.value[overIndex].sort }),
    put({ ...list.value[overIndex], sort: node.data.sort }),
  ])
  getList()
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
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
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
  title: 问卷分类
  order: 2
</route>
