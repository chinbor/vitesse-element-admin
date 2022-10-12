<script lang="ts" setup>
import type { ColumnDef } from '~/composables/agGrid'
defineProps<{
  column: ColumnDef
}>()
defineEmits(['getList'])
</script>

<template>
  <el-switch
    v-model="column.value"
    active-value="true"
    inactive-value="false"
    @update:model-value="$emit('getList')"
  />
</template>
