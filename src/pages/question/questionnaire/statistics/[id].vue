<script setup lang="tsx" name="question-questionnaire-statistics-id">
import { AgGridVue } from 'ag-grid-vue3'
import { ElBadge, ElTag } from 'element-plus'
import { type Question, questionTypeList } from '../../template/[id]/api'
import { getStatisticsList } from './api'

const { id } = defineProps<{ id: string }>()

const { agGridBind, agGridOn } = useAgGrid<Question>(
  () => [
    { headerName: '', field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'content', value: '' },
    { headerName: '选项次数', field: 'options', cellRenderer: { setup: ({ params }) => () =>
      <div className="flex gap-5">{
        params.data?.options?.map(i =>
          <ElBadge value={i.count} type="primary" hidden={!i.count} key={i.id}>
            <ElTag type="info" effect="plain">{i.optionValue}</ElTag>
          </ElBadge>,
        )
      }</div>,
    } },
    { headerName: '类型', field: 'type', valueGetter: ({ data }) => questionTypeList.find(i => i.value === data.type)?.label, value: '', options: questionTypeList },
    { headerName: '必选', field: 'required', valueGetter: ({ data }) => data.required ? '是' : '否', value: '', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] },
  ],
  params => getStatisticsList({ ...params, id }),
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

<style scoped>
::v-deep(.el-badge__content) {
  top: 10px;
}
</style>

<route lang="yaml">
meta:
  title: 问卷统计
  hidden: true
  permission: questionnaireCount
</route>
