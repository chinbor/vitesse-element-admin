<script setup lang="tsx" name="question-type">
import { useRouteQuery } from '@vueuse/router'
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { type Question, getQuestionList, put, questionTypeList } from '../../template/[id]/api'

const { id } = defineProps<{ id: string }>()
const title = $(useRouteQuery('title'))

const { agGridBind, agGridOn, getList } = useAgGrid<Question>(
  () => [
    { field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true, headerValueGetter: ' ' },
    { headerName: '名称', field: 'content', value: '' },
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
  ],
  params => getQuestionList({ ...params, questionnaireId: id }),
)
</script>

<template>
  <div layout>
    <VHeader :title="`调查问题` + ` : ${title}`" />

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
  title: 调查问题
</route>
