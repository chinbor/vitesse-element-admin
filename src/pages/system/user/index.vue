<script setup lang="tsx" name="system-user">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { getRoleList } from '../role/api'
import type { User } from './api'
import { drop, getUserList, put } from './api'
import VForm from './components/VForm.vue'
import DepartmentTree from '~/pages/department/components/DepartmentTree.vue'

let show = $ref(false)
const departmentId = $(useRouteQuery<string>('departmentId'))
const { agGridBind, agGridOn, selectedList, list, getList, row } = useAgGrid<User>(
  [
    { headerName: '', field: 'select', maxWidth: 68, rowDrag: true, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '账号', field: 'username', value: '' },
    { headerName: '角色', valueGetter: ({ data }) => data.roles?.map(i => i.name).join(','), field: 'roles', value: '', form: { props: { multiple: true } }, options: getRoleList },
    { headerName: '部门', valueGetter: ({ data }) => data.department?.name, field: 'department' },
    { headerName: '姓名', field: 'name', value: '' },
    { headerName: '手机号', field: 'phone', value: '' },
    { headerName: '性别', field: 'sex', valueGetter: ({ data }) => data.sex ? '男' : '女', value: '', options: [{ label: '男', value: 1 }, { label: '女', value: 0 }] },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: 'true', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
      <ElSwitch
        disabled={!hasPermission('/users/[id]/put')}
        model-value={props.params.value}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ ...props.params.data, status: !props.params.value })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex justify-between">
        <button v-permission="/users/[id]/put" className="i-fa6-solid:pen-to-square btn" onClick={() => {
          row.value = props.params.data
          show = true
        }}/>
        <button v-permission="/users/[id]/delete" className="i-fa6-solid:trash-can btn" onClick={() => {
          onDrop([props.params.data])
        }}/>
      </div>,
    } },
  ],
  params => getUserList({ ...params, department: departmentId }),
)
watch(() => departmentId, () => {
  getList()
})

async function onDrop(list: User[]) {
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
    sex: 1,
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
      <el-button v-permission="'/users/post'" class="!ml-auto" type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div flex="~ 1" gap-3 m-3>
      <DepartmentTree v-model:departmentId="departmentId" />

      <div main m-0>
        <VFilter />
        <AgGridVue v-bind="agGridBind" v-on="agGridOn" @row-drag-end="rowDragEnd" />
        <Pagination>
          <el-button v-permission="'/users/[id]/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
            删除
          </el-button>
        </Pagination>
      </div>
    </div>

    <VForm v-if="show" v-model="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 用户管理
  order: 2
  permission:
    - title: 列表
      permission: /users
    - title: 添加
      permission: /users/post
    - title: 修改
      permission: /users/[id]/put
    - title: 删除
      permission: /users/[id]/delete
</route>
