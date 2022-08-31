<script setup lang="ts">
import type { ColumnDef } from '~/composables/agGrid'

defineProps<{
  column: ColumnDef
}>()
defineEmits(['getList'])
</script>

<template>
  <el-input
    v-model="column.value"
    placeholder="请输入"
    @clear="$emit('getList')"
  />
</template>
