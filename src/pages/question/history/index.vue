<script setup lang="tsx" name="question-history">
import { AgGridVue } from 'ag-grid-vue3'
import { ElSwitch } from 'element-plus'
import type { History } from './api'
import { getHistoryList } from './api'

const router = useRouter()
const { agGridBind, agGridOn } = useAgGrid<History>(
  () => [
    { headerName: '', field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'title', value: '', cellRenderer: { setup: ({ params }) => () =>
      <a v-permission_disabled="/sys/question/questionnaireHistoryItem/list" className="text-primary hover:opacity-70 cursor-pointer" onClick={() => router.push({ name: 'question-history-id', params: { id: params.data.id }, query: { headerTitle: params.value } })}>{params.value}</a>,
    } },
    { headerName: '前言', field: 'preface', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch model-value={params.value} active-value={1} inactive-value={0}/>,
    } },

  ],
  getHistoryList,
)
</script>

<template>
  <div layout>
    <VHeader />

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
</route>
