<script lang="ts" setup>
import type { Column } from '~/composables/agGrid'

const { column } = defineProps<{
  index: number
  column: Column
}>()

const getList = inject('getList', () => {})

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
    @update:model-value="getList"
  />
</template>
