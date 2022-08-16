<script setup lang="ts">
import type { ColumnDef } from '~/composables/agGrid'

defineProps<{
  index: number
  column: ColumnDef
}>()
const getList = inject('getList', () => {})
</script>

<template>
  <el-input v-model="column.value" placeholder="请输入" @clear="getList" />
</template>
