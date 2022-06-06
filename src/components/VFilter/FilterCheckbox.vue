<script lang="ts" setup>
import type { Column } from '~/composables'
defineProps<{
  index: number
  column: Column
}>()

const getList = inject('getList', () => {})
</script>

<template>
  <el-checkbox
    v-model="column.value"
    false-value="0"
    true-value="1"
    @update:model-value="getList"
  />
</template>
