<script setup lang="tsx">
import type { Column } from '~/composables/agGrid'

defineProps<{
  index: number
  column: Column
}>()
const getList = inject('getList', () => {})
</script>

<template>
  <el-input v-model="column.value" clearable placeholder="请输入" @clear="getList">
    <template v-if="!index" #append>
      <el-button :icon="h('i', { class: 'fa6-solid:magnifying-glass' })" @click="getList" />
    </template>
  </el-input>
</template>
