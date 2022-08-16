<script lang="ts" setup>
import type { ColumnDef } from '~/composables/agGrid'
defineProps<{
  index: number
  column: ColumnDef
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
