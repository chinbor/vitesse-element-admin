<script lang="ts" setup>
import type { ColumnDef } from '~/composables/agGrid'
const { column } = defineProps<{
  column: ColumnDef
}>()
defineEmits(['getList'])
</script>

<template>
  <el-date-picker
    v-model="column.value"
    value-format="YYYY-MM-DD"
    class="!w-64"
    @update:model-value="$emit('getList')"
  />
</template>
