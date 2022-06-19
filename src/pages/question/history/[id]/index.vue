<script setup lang="tsx" name="question-history-id">
import { AgGridVue } from 'ag-grid-vue3'
import { type Question, questionTypeList } from '../../template/[id]/api'
import VForm from '../../template/[id]/components/VForm.vue'
import { getAnswerList } from './api'

const { id } = defineProps<{ id: string }>()
const title = $(useRouteQuery('title'))

const show = $ref(false)
const { agGridBind, agGridOn, row } = useAgGrid<Question>(
  () => [
    { field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true, headerValueGetter: ' ' },
    { headerName: '内容', field: 'content', value: '' },
    { headerName: '类型', field: 'type', valueGetter: ({ data }) => questionTypeList.find(i => i.value === data.type)?.label, value: '', options: questionTypeList },
    { headerName: '必选', field: 'required', valueGetter: ({ data }) => data.required ? '是' : '否', value: '', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] },
  ],
  params => getAnswerList({ ...params, id }),
)
</script>

<template>
  <div layout>
    <VHeader :title="`${$route.meta?.title} : ${title}`" />

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination />
    </div>

    <VForm v-if="show" :id="row.id" v-model:show="show" :params="{ questionnaireId: id }" />
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
