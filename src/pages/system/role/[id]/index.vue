<script setup lang="ts" name="system-role-id">
import { ElLoading, ElTree } from 'element-plus'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { getRole } from '../api'
import { getPermissionList, put } from './api'
import routes from '~pages'

const { id } = defineProps<{ id: string }>()
const pageTitle = useRouteQuery('pageTitle')
getRole(id).then(({ data }) => {
  pageTitle.value = data.name!
})

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
  return result.sort((a, b) => (a?.order || Infinity) - (b?.order || Infinity))
}
const list = $computed(() => routes.reduce(reduce, []))

const treeRef = $shallowRef<InstanceType<typeof ElTree>>()
const filterText = $ref('')
watch(() => filterText, (val) => {
  treeRef.filter(val)
})
const filterNode = (value: string, data: any) => {
  if (!value)
    return true
  return data.meta?.title?.includes(value)
}

let selectedList = $computed({
  get: () => treeRef?.getCheckedKeys(true) as string[],
  set: val => treeRef?.setCheckedKeys(val),
})

async function getList() {
  const { data } = await getPermissionList({ id })
  selectedList = data
}
getList()

async function submit() {
  const loading = ElLoading.service({ fullscreen: true })
  await put({ id, permissions: selectedList }).finally(() => loading.close())
  user.generateRoutes()
  getList()
}
</script>

<template>
  <div layout>
    <VHeader back>
      <el-button v-permission="'/roles/[id]/permissions/put'" type="primary" @click="submit">保存</el-button>
    </VHeader>
    <div main>
      <el-input
        v-model="filterText"
        placeholder="请输入"
      />
      <ElTree
        ref="treeRef"
        flex justify-around items-start
        default-expand-all
        show-checkbox
        node-key="permission"
        :filter-node-method="filterNode"
        :data="list"
        :props="{ label: (data:any) => data.title || '详情' }"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
  permission:
    - title: 列表
      permission: /roles/[id]/permissions
    - title: 保存
      permission: /roles/[id]/permissions/put
</route>
