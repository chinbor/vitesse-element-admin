<script setup lang="tsx" name="blog">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { RouterLink } from 'vue-router'
import type { Blog } from './api'
import { drop, getBlogList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
const { agGridProps, agGridEvents, selectedList, getList, list, row } = useAgGrid<Blog>(
  [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', suppressHide: true, sortable: false, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '', cellRenderer: { setup: ({ params }) => () =>
      <RouterLink
        v-permission_disabled="/blogs/[id]/contents"
        class="cursor-pointer text-primary hover:opacity-70"
        to={`/blog/${params.data.id}` }
      >
        {params.value}
      </RouterLink>,
    } },
    { headerName: '描述', field: 'description', value: '' },
    { headerName: '描述1', field: 'description1' },
    { headerName: '描述2', field: 'description2' },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', form: { type: 'switch' }, cellRenderer: { setup: ({ params }) => () =>
      <ElSwitch
        disabled={!user.hasPermission('/blogs/[id]/put')}
        model-value={params.value}
        onChange={ async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ id: params.data.id, status: !params.value })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', maxWidth: 68, suppressHide: true, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex justify-between">
        <button v-permission="/blogs/[id]/put" className="i-fa6-solid:pen-to-square btn"
          onClick={() => {
            show = true
            row.value = props.params.data
          }}
        />
        <button v-permission="/blogs/[id]/delete" className="i-fa6-solid:trash-can btn"
          onClick={() => onDrop([props.params.data])}
        />
      </div>,
    } },
  ],
  getBlogList,
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
    put({ id: node.data.id, index: list.value[overIndex].index }),
    put({ id: list.value[overIndex].id, index: node.data.index }),
  ]).then(() => getList())
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button v-permission="'/blogs/post'" class="!ml-auto" type="primary" @click="addHandler">
        <i i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <AgGridVue v-bind="agGridProps" v-on="agGridEvents" @row-drag-end="rowDragEnd" />
      <Pagination>
        <el-button v-permission="'/blogs/[id]/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop()">
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
