<script setup lang="tsx">
import { ElTree } from 'element-plus'
import { type Department, getDepartment, getDepartmentList } from '../api'

const props = defineProps<{
  departmentId: Department['id']
}>()

const departmentId = $(useVModel(props, 'departmentId'))
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

const list = $ref<Department[]>([])

async function onload(node: any, resolve: any) {
  if (node.level === 0) {
    resolve([{ id: '', name: '全部', hasChildren: true }])
  } else if (!node.data.hasChildren) {
    resolve([])
  } else {
    const { data } = await getDepartmentList({ parentId: node.data.id, pageSize: 9999 })
    resolve(data)
  }
}

let department = $ref<Department>()
watch(() => departmentId, async () => {
  department = departmentId
    ? await getDepartment(departmentId).then(i => i.data)
    : { hasChildren: true }
}, { immediate: true })

defineExpose($$({
  department,
}))
</script>

<template>
  <div flex="~ col" gap-3 rounded shadow min-w-40 p-3 bg="white dark:zinc-900">
    <el-input v-model="search" placeholder="搜索">
      <template #append><i i-fa6-solid:magnifying-glass /></template>
    </el-input>

    <ElTree
      ref="treeRef"
      v-slot="{ node }"
      flex-1 overflow-auto
      :current-node-key="departmentId || ''"
      highlight-current
      :default-expanded-keys="['', ...(department?.path || [])]"
      node-key="id"
      lazy
      :filter-node-method="filterNode"
      :data="list"
      :props="{
        label: 'name',
        isLeaf: (data:any) => !data.hasChildren,
      }"
      :load="onload"
      @current-change="departmentId = $event.data.id || undefined"
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
