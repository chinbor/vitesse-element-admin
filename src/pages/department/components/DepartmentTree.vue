<script setup lang="tsx">
import { ElTree } from 'element-plus'
import { type Department, getDepartmentList } from '../api'

const { department, ...props } = defineProps<{
  departmentId: Department['id']
  department: Department
}>()
let departmentId = $(useVModel(props, 'departmentId'))
const treeRef = $shallowRef<InstanceType<typeof ElTree>>()

const filterNode = (value: string, data: any) => {
  if (!value)
    return true
  return data.name?.includes(value)
}

const search = ref('')
watch(search, (val) => {
  treeRef.filter(val)
})
let loading = $ref(false)
const list = $ref<Department[]>([])

async function onload(node: any, resolve: any) {
  if (node.level === 0) {
    return resolve([{ id: '', name: '全部', hasChildren: true }])
  } else if (!node.data.hasChildren) {
    return resolve([])
  } else {
    loading = true
    const { data } = await getDepartmentList({ parentId: node.data.id, pageSize: 9999 }).finally(() => loading = false)
    resolve(data)
  }
  departmentId && treeRef.setCurrentKey(departmentId)
}

function onCurrentChange(data: Department) {
  if (!data?.id)
    return departmentId = undefined
  departmentId = data.id
}
</script>

<template>
  <div v-loading="loading" flex="~ col" rounded shadow min-w-40 p-3 bg="white dark:zinc-900">
    <el-input v-model="search" placeholder="搜索">
      <template #append><i i-fa6-solid:magnifying-glass /></template>
    </el-input>
    <ElTree
      ref="treeRef"
      v-slot="{ node }"
      pt-3 flex-1
      highlight-current
      :current-node-key="departmentId || ''"
      :default-expanded-keys="['', ...(department.path || [])]"
      node-key="id"
      lazy
      :filter-node-method="filterNode"
      :data="list"
      :props="{
        label: 'name',
        isLeaf: (data) => !data.hasChildren,
      }"
      :load="onload"
      @current-change="onCurrentChange"
    >
      <i
        mr-1 bg-gray-400 text-sm
        :class="{
          [!node.data.id ? 'mi:home'
            : node.data.hasChildren
              ? node.expanded ? 'mi:folder-remove' : 'mi:folder-add'
              : 'mi:document']: true,
          'bg-primary': node.isCurrent,
        }"
      />
      {{ node.data.name }}
    </ElTree>
  </div>
</template>
