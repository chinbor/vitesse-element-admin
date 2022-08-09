<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import { getDepartmentList } from '../department/api'
import { getEnumList } from '../enum/index/api'
import { getArticleList } from '~/pages/article/api'
import { getUserList } from '~/pages/system/user/api'

const list = $ref([
  { icon: 'i-ic:outline-menu-book mb-1', color: 'blue-500', label: '知识库', count: 0, name: 'article' },
  { icon: 'i-ic:baseline-account-tree', color: 'teal-500', label: '部门管理', count: 0, name: 'department' },
  { icon: 'i-ic:baseline-people-alt indigo-500', color: 'indigo-500', label: '用户管理', count: 0, name: 'system-user' },
  { icon: 'i-ic:baseline-settings rose-500', color: 'rose-500', label: '角色权限', count: 0, name: 'system-role' },
])
async function getList() {
  const params = { page: 1, pageSize: 0 }
  getArticleList(params).then(({ total }) => list[0].count = total)
  getDepartmentList(params).then(({ total }) => list[1].count = total)
  getUserList(params).then(({ total }) => list[2].count = total)
  getEnumList(params).then(({ total }) => list[3].count = total)
}
getList()
</script>

<template>
  <div p-10>
    <div grid="~ cols-4 lt-md:cols-2" gap-10>
      <div
        v-for="i in list" :key="i.icon"
        class="group" b="0 t gray-50 dark:zinc-800" cursor-pointer shadow="~ dark:zinc-800" rounded-lg h-30 p-5 flex items-center
        @click="$router.push(i)"
      >
        <div flex items-center mr-auto rounded p-3 py-2 transition-colors duration-500 :class="`group-hover:bg-${i.color}`">
          <i :class="`${i.icon} transition-colors duration-500 group-hover:text-white text-${i.color}`" text-5xl />
        </div>
        <div font-medium text-right>
          <span text-gray-400>{{ i.label }}</span>
          <CountUp mt-1 text-2xl :class="`text-${i.color}`" font-600 :end-val="i.count" />
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
