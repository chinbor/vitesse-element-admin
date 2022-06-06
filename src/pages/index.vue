<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import { getMealList } from './menu/meal/api'
import { getPlanList } from './menu/plan/api'
import { getStaffList } from './person/staff/api'
import { getDeviceList } from './system/device/api'
import { useTagsviewStore } from '~/stores/tagsview'
const list = $ref([
  { icon: 'ic:outline-menu-book mb-1', color: 'blue-500', label: '今日菜单', count: 0, to: 'plan' },
  { icon: 'ic:outline-local-dining', color: 'teal-500', label: '预报餐', count: 0, to: 'meal' },
  { icon: 'ic:baseline-people-alt indigo-500', color: 'indigo-500', label: '人员信息', count: 0, to: 'staff' },
  { icon: 'ic:sharp-settings rose-500', color: 'rose-500', label: '设备管理', count: 0, to: 'device' },
])
async function getList() {
  const params = { pageIndex: 1, pageSize: 0 };
  ([
    { total: list[0].count },
    { total: list[1].count },
    { total: list[2].count },
    { total: list[3].count },
  ] = await Promise.all([
    getMealList(params),
    getPlanList(params),
    getStaffList(params),
    getDeviceList(params),
  ]))
}
getList()
const tagsView = useTagsviewStore()
</script>

<template>
  <div p-10>
    <div grid="~ cols-4 lt-md:cols-2" gap-10>
      <div
        v-for="i in list" :key="i.icon"
        class="group" b="0 t gray-50 dark:zinc-800" cursor-pointer shadow="lg dark:zinc-800" rounded-lg h-30 p-5 flex items-center
        @click="tagsView.push(i.to)"
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
  layout: default
  icon: icons8:home
  title: 首页
</route>
