<script setup lang="tsx" name="question-history-id">
import { AgGridVue } from 'ag-grid-vue3'
import { ElCheckbox, ElRadio, ElRadioGroup } from 'element-plus'
import { type Question, questionTypeList } from '../../template/[id]/api'
import { getHistoryItemList } from './api'

const { id } = defineProps<{ id: string }>()

const { agGridBind, agGridOn } = useAgGrid<Question>(
  () => [
    { headerName: '', field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'content', value: '' },
    { headerName: '选项', field: 'options', cellRenderer: { setup: ({ params }) => {
      const type = questionTypeList.find(i => i.value === params.data.type)?.type
      return () =>
        <div>{
          type === 'radio-group'
            ? <ElRadioGroup modelValue={params.data.answer}>
              {() => params.data?.options?.map(i =>
                <ElRadio key={i.id} label={i.id}>{i.optionValue}</ElRadio>,
              )}
          </ElRadioGroup>
            : type === 'checkbox'
              ? params.data?.options?.map(i =>
                <ElCheckbox checked={!!i.answerFlag} class="pointer-events-none" key={i.id} label={i.optionValue}/>,
              )
              : <div>{params.data.answer}</div>
        }</div>
    } } },
    { headerName: '类型', field: 'type', valueGetter: ({ data }) => questionTypeList.find(i => i.value === data.type)?.label, value: '', options: questionTypeList },
    { headerName: '必选', field: 'required', valueGetter: ({ data }) => data.required ? '是' : '否', value: '', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] },
  ],
  params => getHistoryItemList({ ...params, id }),
)
</script>

<template>
  <div layout>
    <VHeader back />

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
