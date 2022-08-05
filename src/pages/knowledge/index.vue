<script setup lang="tsx" name="knowledge">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { Knowledge } from './api'
import { drop, getKnowledgeTypeList, put } from './api'
import VForm from './components/VForm.vue'

const router = useRouter()
let show = $ref(false)
const { agGridBind, agGridOn, selectedList, getList, list, row } = useAgGrid<Knowledge>(
  [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '', cellRenderer: { setup: ({ params }) => () =>
      <a v-permission_disabled="/knowledge/[id]/contents" className="cursor-pointer text-primary hover:opacity-70" onClick={() => router.push({ name: 'knowledge-id', params: { id: params.data.id }, query: { headerTitle: params.value } })}>{params.value}</a>,
    } },
    { headerName: '描述', field: 'description', value: '' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch disabled={!hasPermission('/knowledge/[id]/put')} model-value={params.value}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: !params.value })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, unCheck: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex justify-between">
        <button v-permission="/knowledge/[id]/put" className="i-fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          row.value = props.params.data
        }}/>
        <button v-permission="/knowledge/[id]/delete" className="i-fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
      </div>,
    } },
  ],
  getKnowledgeTypeList,
)

async function onDrop(list = selectedList.value) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row.value = {
    status: true,
  }
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
    <VHeader>
      <el-button v-permission="'/knowledge/post'" class="!ml-auto" type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <AgGridVue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/knowledge/[id]/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop()">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
