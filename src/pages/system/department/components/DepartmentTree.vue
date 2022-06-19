<script setup lang="tsx">
import { ElTree } from 'element-plus'
import type { Department } from '../api'
import { getDepartmentList } from '../api'

const props = defineProps<{
  departmentId: Department['id']
}>()
let departmentId = $(useVModel(props, 'departmentId'))

const treeRef = $ref<InstanceType<typeof ElTree>>()
const filterNode = (value: string, data: Department) => {
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
  loading = true
  const { data } = await getDepartmentList({ parentId: node.data.id, pageSize: 9999 }).finally(() => loading = false)
  resolve(node.data.id ? data : [{ id: '', name: '全部', hasChildren: true }, ...data])
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
      <template #append>
        <i fa6-solid:magnifying-glass />
      </template>
    </el-input>
    <el-tree
      ref="treeRef"
      v-slot="{ node }"
      pt-3 flex-1
      highlight-current
      :current-node-key="departmentId || ''"
      :default-expanded-keys="[departmentId || '']"
      node-key="id"
      lazy
      :filter-node-method="filterNode"
      :data="list"
      :props="{
        label: 'name',
        isLeaf: 'hasChildren',
      }"
      :load="onload"
      @current-change="onCurrentChange"
    >
      <i
        mr-1 bg-gray-400 text-sm
        :class="{
          [!node.data.id ? 'mi:home'
            : node.data.hasChildren
              ? 'mi:document' : node.expanded ? 'mi:folder-remove'
                : 'mi:folder-add']: true,
          'bg-primary': node.isCurrent,
        }"
      />
      {{ node.data.name }}
    </el-tree>
  </div>
</template>
