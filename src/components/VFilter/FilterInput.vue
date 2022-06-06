<script setup lang="tsx">
import type { Column } from '~/composables'
defineProps<{
  index: number
  column: Column
}>()

const getList = inject('getList', () => {})
</script>

<template>
  <el-input v-model="column.value" clearable placeholder="请输入" @clear="getList" @keydown.enter="getList">
    <template v-if="!index" #append>
      <i cursor-pointer class="fa6-solid:magnifying-glass" @click="getList" />
    </template>
  </el-input>
</template>
