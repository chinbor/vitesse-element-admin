<script setup lang="tsx" name="knowledge-content">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getKnowledgeTypeList } from '../type/api'
import type { KnowledgeContent } from './api'
import { drop, getTemplateList } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)

const { agGridBind, agGridOn, selectedList, getList, row } = useAgGrid<KnowledgeContent>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'title', value: '' },
    { headerName: '知识库', valueGetter: 'data.knowledgeBase.title', field: 'knowledgeBase.id', value: '', form: { optionLabel: 'title' }, options: getKnowledgeTypeList },
    { headerName: '内容', field: 'content', value: '' },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row.value = props.params.data
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>,
    } },
  ],
  getTemplateList,
)

async function onDrop(list = selectedList.value) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
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

    <VForm v-if="show" :id="row.id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 内容管理
  order: 2
</route>
