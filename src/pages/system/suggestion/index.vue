<script setup lang="tsx" name="system-suggestion">
import { AgGridVue } from 'ag-grid-vue3'
import { ElImage, ElLoading, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { Suggestion } from './api'
import { drop, getSuggestion, getSuggestionList, put } from './api'

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Suggestion>(
  () => [
    { headerName: '', field: 'select', maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '图片', field: 'pictures', cellRenderer: { setup(props) {
      let pictures = $ref<string[]>([])
      getSuggestion(props.params.data.id).then(({ data }) => pictures = data.pictures!.map(i => `/sys/image/get/?fileName=${i.url}&decrypt=true`))
      return () => <div className="flex gap-1">{
        pictures.map((i, index) => <ElImage key={i} v-show={props.params.value} previewTeleported preview-src-list={pictures} initial-index={index} src={i}/>)
      }</div>
    } } },
    { headerName: '意见', field: 'suggestion', value: '' },
    { headerName: '时间', field: 'creationTime' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/sys/suggestion/edit')} model-value={params.value} active-value={1} inactive-value={0}
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
        <button v-permission="/sys/suggestion/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
      </div>,
    } },
  ],
  getSuggestionList,
)

async function onDrop(list = selectedList.value) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const { close } = ElLoading.service()
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))).finally(close))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}
</script>

<template>
  <div layout>
    <VHeader />

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button v-permission="'/sys/suggestion/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop()">
          删除
        </el-button>
      </Pagination>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.el-image) {
  @apply h-10 cursor-pointer !inline-block;
}
</style>

<route lang="yaml">
meta:
  title: 意见收集
  permission:
    - title: 列表
      permission: /sys/suggestion/list
    - title: 修改
      permission: /sys/suggestion/edit
    - title: 删除
      permission: /sys/suggestion/delete
</route>
