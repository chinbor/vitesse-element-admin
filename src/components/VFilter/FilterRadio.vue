<script lang="ts" setup>
import type { ColumnDef } from '~/composables/agGrid'
const props = defineProps<{
  column: ColumnDef
}>()

const getList = inject('getList', () => {})

let options = $ref<any>([])
if (typeof props.column.options === 'function') {
  props.column.options({ page: 1, pageSize: 99999, status: true }).then((i: any) => {
    options = i.data
  })
} else {
  options = props.column.options
}
</script>

<template>
  <el-radio-group
    v-model="column.value"
    class="flex whitespace-nowrap items-center !w-auto"
    @update:model-value="getList"
  >
    <el-radio v-for="i in options" :key="i.value" :label="`${i.value}`">{{ i.label }}</el-radio>
  </el-radio-group>
</template>
