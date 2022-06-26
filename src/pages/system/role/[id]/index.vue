<script setup lang="ts" name="system-role-id">
import { ElTree } from 'element-plus'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { put } from '../api'
import { getPermissionList, post } from './api'
import routes from '~pages'

const { id } = defineProps<{ id: string }>()

function reduce(
  result: (RouteMeta & { children?: RouteMeta[] })[],
  route: RouteRecordRaw,
) {
  const meta = { ...route.meta, children: [] } as RouteMeta & { children: RouteMeta[] }
  if (meta?.permission) {
    if (Array.isArray(meta?.permission) && meta?.permission.length)
      meta.children.push(...meta.permission)
    if (route.children?.length)
      meta.children = route.children.reduce(reduce, meta.children)
    result.push(meta)
  }
  return result
}
const list = $computed(() => routes.reduce(reduce, []))

const treeRef = $shallowRef<InstanceType<typeof ElTree>>()
const filterText = $ref('')
watch(() => filterText, (val) => {
  treeRef.filter(val)
})
const filterNode = (value: string, data: RouteRecordRaw) => {
  if (!value)
    return true
  return data.meta?.title?.includes(value)
}

window.treeRef = $$(treeRef)
const selectedList = $computed({
  get: () => treeRef?.getCheckedKeys(true),
  set: val => treeRef?.setCheckedKeys(val),
})

const user = useUserStore()
async function getList() {
  await nextTick()
  // const { data } = await getPermissionList({ id })
  selectedList = user.permissionList
}
getList()

async function sync() {
  await Promise.allSettled(selectedList.map(i => post({
    name: i.title,
    type: 4,
    path: i.permission,
    useFlag: 1,
    deleteFlag: 0,
  })))
  getList()
}

const routeStore = useRouteStore()
async function submit() {
  // await put({ id, resources: selectedList.map(i => ({ name: i.title })) })
  user.permissionList = selectedList
  routeStore.generateRoutes()
}
</script>

<template>
  <div layout>
    <VHeader back>
      <el-button @click="sync">同步</el-button>
      <el-button v-permission="'roleIdPut'" type="primary" @click="submit">保存</el-button>
    </VHeader>
    <div main>
      <el-input
        v-model="filterText"
        placeholder="请输入"
      />
      <el-tree
        ref="treeRef"
        flex justify-around
        default-expand-all
        show-checkbox
        node-key="permission"
        :filter-node-method="filterNode"
        :data="list"
        :props="{ label: (data) => data.title || '详情' }"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
  permission:
    - title: 列表
      permission: roleId
    - title: 修改
      permission: roleIdPut
</route>
