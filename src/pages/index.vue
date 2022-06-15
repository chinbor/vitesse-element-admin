<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import { getKnowledgeTypeList } from './knowledge/type/api'
import { getQuestionnaireList } from './question/questionnaire/api'
import { getUserList } from './system/user/api'
const list = $ref([
  { icon: 'ic:outline-menu-book mb-1', color: 'blue-500', label: '知识库', count: 0, name: 'knowledge-type' },
  { icon: 'ep:question-filled', color: 'teal-500', label: '问卷调查', count: 0, name: 'meal' },
  { icon: 'ic:baseline-people-alt indigo-500', color: 'indigo-500', label: '用户管理', count: 0, name: 'staff' },
  { icon: 'ic:baseline-handyman rose-500', color: 'rose-500', label: '报修管理', count: 0, name: 'device' },
])
async function getList() {
  const params = { page: 1, pageSize: 0 };
  ([
    { total: list[0].count },
    { total: list[1].count },
    { total: list[2].count },
  ] = await Promise.all([
    getKnowledgeTypeList(params),
    getQuestionnaireList(params),
    getUserList(params),
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
        class="group" b="0 t gray-50 dark:zinc-800" cursor-pointer shadow="~ dark:zinc-800" rounded-lg h-30 p-5 flex items-center
        @click="tagsView.push({ name: i.name })"
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
  icon: ic:outline-home !text-2xl
  title: 首页
</route>
