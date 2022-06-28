<script setup lang="tsx" name="knowledge-id">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { KnowledgeContent } from './api'
import { drop, getKnowledgeContentList, put } from './api'
import VForm from './components/VForm.vue'

const { id } = defineProps<{ id: string }>()

let show = $ref(false)
const { agGridBind, agGridOn, selectedList, getList, row, list } = useAgGrid<KnowledgeContent>(
  () => [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '标题', field: 'title', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/sys/knowledgeContent/edit')} model-value={params.value} active-value={1} inactive-value={0}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: params.value ? 0 : 1 })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, maxWidth: 68, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex items-center justify-between">
        <button v-permission="/sys/knowledgeContent/edit" className="fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          row.value = props.params.data
        }}/>
        <button v-permission="/sys/knowledgeContent/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
      </div>,
    } },
  ],
  params => getKnowledgeContentList({ ...params, knowledgeBaseId: id }),
)

async function onDrop(list = selectedList.value) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function rowDragEnd({ node, overIndex }: any) {
  Promise.all([
    put({ id: node.data.id, sort: list.value[overIndex].sort }),
    put({ id: list.value[overIndex].id, sort: node.data.sort }),
  ]).then(() => getList())
}

function addHandler() {
  show = true
  row.value = {}
}
</script>

<template>
  <div layout>
    <VHeader back>
      <el-button v-permission="'/sys/knowledgeContent/add'" class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/sys/knowledgeContent/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
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
  permission:
    - title: 列表
      permission: /sys/knowledgeContent/list
    - title: 添加
      permission: /sys/knowledgeContent/add
    - title: 修改
      permission: /sys/knowledgeContent/edit
    - title: 删除
      permission: /sys/knowledgeContent/delete
</route>
