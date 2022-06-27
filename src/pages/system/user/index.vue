<script setup lang="tsx" name="system-user">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { getDepartmentList } from '../department/api'
import { getRoleList } from '../role/api'
import type { User } from './api'
import { drop, getUserList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
const { agGridBind, agGridOn, selectedList, getList, row } = useAgGrid<User>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '账号', field: 'username', value: '' },
    { headerName: '角色', valueGetter: ({ data }) => data.roles?.map(i => i.name).join(','), field: 'roles.id', value: '', form: { props: { multiple: true } }, options: getRoleList },
    { headerName: '部门', valueGetter: ({ data }) => data.departments?.map(i => i.name).join(','), field: 'department.id', value: '', form: { props: { multiple: false } }, options: getDepartmentList },
    { headerName: '姓名', field: 'name', value: '' },
    { headerName: '手机号', field: 'phone', value: '' },
    { headerName: '性别', field: 'sex', valueGetter: ({ data }) => data.sex ? '男' : '女', value: '', options: [{ label: '男', value: 1 }, { label: '女', value: 0 }] },
    { headerName: '状态', field: 'status', suppressSizeToFit: true, value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
      <ElSwitch disabled={!hasPermission('/sys/user/edit')} model-value={props.params.value} active-value={1} inactive-value={0}
        onChange={async () => {
          await ElMessageBox.confirm('确定修改状态?', '提示')
          await put({ ...props.params.data, status: props.params.value ? 0 : 1 })
          ElMessage.success('操作成功')
          getList()
        } }
      />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
      <div className="flex items-center justify-between">
        <button v-permission="/sys/user/edit" className="fa6-solid:pen-to-square btn" onClick={() => {
          show = true
          row.value = props.params.data
        }}/>
        <button v-permission="/sys/user/delete" className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
      </div>,
    } },
  ],
  getUserList,
)

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
  row.value = {}
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button v-permission="'userPost'" class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button v-permission="'/sys/user/delete'" type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" :id="row.id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 用户管理
  order: 2
  permission:
    - title: 列表
      permission: /sys/user/list
    - title: 添加
      permission: /sys/user/add
    - title: 修改
      permission: /sys/user/edit
    - title: 删除
      permission: /sys/user/delete
</route>
