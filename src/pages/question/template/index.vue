<script setup lang="tsx" name="question-template">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { getQuestionTypeList } from '../type/api'
import type { Template } from './api'
import { drop, getTemplateList, put } from './api'
import VForm from './components/VForm.vue'

const router = useRouter()
let show = $ref(false)
const { agGridBind, agGridOn, selectedList, getList, row } = useAgGrid<Template>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'title', value: '', cellRenderer: { setup: ({ params }) => () =>
      <a v-permission_disabled="/sys/question/question/list" className="text-primary hover:opacity-70 cursor-pointer" onClick={() => router.push({ name: 'question-template-id', params: { id: params.data.id }, query: { headerTitle: params.value } })}>{params.value}</a>,
    } },
    { headerName: '类型', field: 'classification.id', valueGetter: ({ data }) => data.classification?.name, value: '', options: getQuestionTypeList },
    { headerName: '前言', field: 'preface' },
    { headerName: '创建时间', field: 'creationTime' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/sys/question/template/edit')} model-value={params.value} active-value={1} inactive-value={0}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: params.value ? 0 : 1 })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex items-center justify-between">
        <button v-permission="/sys/question/template/edit" className="fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          row.value = props.params.data
        }}/>
        <button v-permission="/sys/question/template/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
      </div>,
    } },
  ],
  getTemplateList,
)

async function onDrop(list: Template[]) {
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
      <el-button v-permission="'/sys/question/template/add'" class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button v-permission="'/sys/question/template/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" :id="row.id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
