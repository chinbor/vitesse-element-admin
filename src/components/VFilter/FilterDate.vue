<script lang="ts" setup>
import type { ColumnDef } from '~/composables/agGrid'

const { column } = defineProps<{
  column: ColumnDef
}>()
defineEmits(['getList'])

const value = computed({
  set(val: any) {
    column.value = column.field?.includes(',') ? val?.join(',') : val
  },
  get() {
    return column.value?.includes(',') ? column.value?.split(',') : column.value
  },
})
</script>

<template>
  <el-date-picker
    v-model="value"
    value-format="YYYY-MM-DD"
    @update:model-value="$emit('getList')"
  />
</template>
