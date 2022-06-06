<script setup lang="tsx" name="food">
import { AgGridVue } from 'ag-grid-vue3'
import { ElImage, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { getFoodTypeList } from '../food-type/api'
import { type FoodRow, drop, getFoodList, put } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<FoodRow>()
const previewSrcList = $computed(() => (list: FoodRow[] = []) => list.map(i => `/api/file${i.photoName}`))
const { agGridBind, agGridOn, selectedList, list, getList } = useAgGrid<FoodRow>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '图片', field: 'photoName', cellRenderer: { setup(props) {
      const src = `/api/file${props.params.value}`
      return () => <ElImage v-show={props.params.value} initial-index={props.params.rowIndex} previewTeleported preview-src-list={previewSrcList(list.value)} src={src} class="h-10 mt-4 cursor-pointer"/>
    } } },
    { headerName: '类型', valueGetter: ({ data }) => data.foodEnums.map(i => i.name), field: 'foodEnums', value: '', options: ({ value: enumName, ...params }) =>
      getFoodTypeList({ ...params, enumName }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.enumName, value: i.id })),
        total,
      })),
    },
    { headerName: '能量', field: 'calorie', value: '' },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <ElSwitch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: !props.params.value ? 1 : 0 })
            ElMessage.success('操作成功')
            getList()
          } }
          active-value={1}
          inactive-value={0}
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
  getFoodList,
)

async function onDrop(list: FoodRow[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { } as FoodRow
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
        <el-button :disabled="!selectedList.length" type="primary" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
name: food
meta:
  title: 菜品管理
</route>
