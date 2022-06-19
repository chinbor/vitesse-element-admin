<script setup lang="tsx" name="question-questionnaire-id">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { type Question, drop, getQuestionList, put, questionTypeList } from '../../template/[id]/api'
import VForm from '../../template/[id]/components/VForm.vue'

const { id } = defineProps<{ id: string }>()
const title = $(useRouteQuery('title'))

let show = $ref(false)
const { agGridBind, agGridOn, getList, row, selectedList, list } = useAgGrid<Question>(
  () => [
    { field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true, headerValueGetter: ' ' },
    { headerName: '内容', field: 'content', value: '' },
    { headerName: '类型', field: 'type', valueGetter: ({ data }) => questionTypeList.find(i => i.value === data.type)?.label, value: '', options: questionTypeList },
    { headerName: '必选', field: 'required', valueGetter: ({ data }) => data.required ? '是' : '否', value: '', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
        <ElSwitch model-value={params.value} active-value={1} inactive-value={0}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ id: params.data.id, status: params.value ? 0 : 1 })
            ElMessage.success('操作成功')
            getList()
          } }
        />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, unCheck: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: ({ params }) => () =>
        <div className="flex justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={async () => {
            show = true
            row.value = params.data
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
        </div>,
    } },
  ],
  params => getQuestionList({ ...params, questionnaireId: id }),
)

async function onDrop(list: Question[]) {
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
    <VHeader :title="`${$route.meta?.title} : ${title}`">
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

    <VForm v-if="show" :id="row.id" v-model:show="show" :params="{ questionnaireId: id }" />
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
