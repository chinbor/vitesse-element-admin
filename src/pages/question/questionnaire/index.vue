<script setup lang="tsx" name="questionnaire">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
// import { getTemplateList } from '../template/api'
import type { Questionnaire } from './api'
import { drop, getQuestionnaireList, put } from './api'
import VForm from './components/VForm.vue'

let show = $ref(false)
let id = $ref<Questionnaire['id']>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Questionnaire>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '账号', field: 'username', value: '' },
    // { headerName: '角色', valueGetter: ({ data }) => data.roles?.map(i => i.name).join(','), field: 'roleId', value: '', options: getTemplateList },
    { headerName: '姓名', field: 'name', value: '' },
    { headerName: '手机号', field: 'phone', value: '' },
    { headerName: '性别', field: 'sex', valueGetter: ({ data }) => data.sex ? '男' : '女', value: '', options: [{ label: '男', value: 1 }, { label: '女', value: 0 }] },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <ElSwitch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: props.params.value ? 0 : 1 })
            ElMessage.success('操作成功')
            getList()
          } }
          active-value={1}
          inactive-value={0}
        />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup: props => () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            id = props.params.data.id
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>,
    } },
  ],
  getQuestionnaireList,
)

async function onDrop(list: Questionnaire[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据？`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  id = ''
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" :id="id" v-model:show="show" />
  </div>
</template>

<route lang="yaml">
name: questionnaire
meta:
  permission: /get/user
  title: 问卷调查
  order: 1
</route>
