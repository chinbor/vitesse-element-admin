<script lang="ts" setup>
import type { ColumnDef } from '~/composables/agGrid'
const { column } = defineProps<{
  column: ColumnDef
}>()
defineEmits(['getList'])

let options = $ref<any>([])
if (typeof column.options === 'function') {
  column.options(undefined, { page: 1, pageSize: 99999 }).then((i: any) => {
    options = i.data
  })
} else {
  options = column.options
}
</script>

<template>
  <el-radio-group
    v-model="column.value"
    class="flex whitespace-nowrap items-center !w-auto"
    @update:model-value="$emit('getList')"
  >
    <el-radio
      v-for="i in options"
      :key="i.value"
      :label="`${i.value}`"
    >
      {{ i.label }}
    </el-radio>
  </el-radio-group>
</template>
