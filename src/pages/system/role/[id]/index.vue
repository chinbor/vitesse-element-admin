<script setup lang="ts">
import { ElTree } from 'element-plus'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { put } from '../api'
import { getPermissionList, post } from './api'
import routes from '~pages'

const { id } = defineProps<{ id: string }>()

type Item = RouteMeta & { children: RouteMeta[] }
function reduce(result: Item[], route: RouteRecordRaw) {
  const meta = { ...route.meta, children: [] } as Item
  if (meta?.permission) {
    if (Array.isArray(meta?.permission) && meta?.permission.length)
      meta.children.push(...meta.permission)
    if (route.children?.length)
      meta.children = route.children.reduce(reduce, [])
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

const selectedList = $computed({
  get: () => treeRef?.getCheckedNodes(true) as RouteMeta[],
  // @ts-expect-error ignore
  set: val => treeRef?.setCheckedNodes(val),
})

async function getList() {
  const { data } = await getPermissionList({ id })
  selectedList = data
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

async function submit() {
  await put({ id, resources: selectedList.map(i => ({ name: i.title })) })
}
</script>

<template>
  <div layout>
    <VHeader back>
      <el-button @click="sync">同步</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </VHeader>
    <div main>
      <el-input
        v-model="filterText"
        placeholder="请输入"
      />
      {{ selectedList }}
      <el-tree
        ref="treeRef"
        v-model="selectedList"
        flex justify-around
        default-expand-all
        show-checkbox
        node-key="id"
        :filter-node-method="filterNode"
        :data="list"
        :props="{ label: (data) => data.title }"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
