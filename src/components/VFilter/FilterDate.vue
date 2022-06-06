<script lang="ts" setup>
import type { Column } from '~/composables'
const { column } = defineProps<{
  index: number
  column: Column
}>()

const getList = inject('getList', () => {})

const route = useRoute()
const value = computed({
  set(val: any) {
    column.value = val
  },
  get() {
    if (column.field.includes(','))
      return column.field?.split(',').map(v => route.query[v])

    return column.value
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
