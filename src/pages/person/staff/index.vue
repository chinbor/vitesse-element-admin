<script setup lang="tsx" name="staff">
import { AgGridVue } from 'ag-grid-vue3'
import { ElImage, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { getDepartmentList } from '../department/api'
import type { Row } from './api'
import { drop, getStaffList, put } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<Row>()

const previewSrcList = $computed(() => (list: Row[] = []) => list.map(i => `/api/file${i.photoName}`))
const { agGridBind, agGridOn, selectedList, getList, list } = useAgGrid<Row>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '姓名', field: 'name', value: '' },
    { headerName: '部门', valueGetter: 'data.department.departmentName', field: 'department', value: '', options: ({ value: departmentName, ...params }) =>
      getDepartmentList({ ...params, departmentName }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.departmentName, value: i.id })),
        total,
      })),
    },
    { headerName: '照片', field: 'photoName', cellRenderer: { setup(props) {
      const src = `/api/file${props.params.value}`
      return () => <ElImage v-show={props.params.value} initial-index={props.params.rowIndex} previewTeleported preview-src-list={previewSrcList(list.value)} src={src} class="h-10 mt-4 cursor-pointer"/>
    } } },
    { headerName: '性别', field: 'sex', valueGetter: ({ data }) => data.sex ? '男' : '女' },
    { headerName: '手机号', field: 'phone', value: '' },
    { headerName: '职位', field: 'job' },
    { headerName: '职级', field: 'rank' },
    { headerName: '余额', field: 'money' },
    { headerName: '入职时间', field: 'entryDate' },
    { headerName: '退休时间', field: 'retirementDate' },
    { headerName: '住址', field: 'address' },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <ElSwitch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: !props.params.value })
            ElMessage.success('操作成功')
            getList()
          } }
        />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props) {
      return () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = props.params.data
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>
    } } },
  ],
  getStaffList,
)

async function onDrop(list = [row]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { sex: 1, status: 1 }
}
</script>

<template>
  <div flex="~ col nowrap" bg="zinc-100 dark:zinc-800">
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div m-3 p-3 pb-2 bg="white dark:zinc-900" shadow rounded flex="~ 1 col" gap-2>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
name: staff
meta:
  title: 人员信息
  order: 1
</route>
