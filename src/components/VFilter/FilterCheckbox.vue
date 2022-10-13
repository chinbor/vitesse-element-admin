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

const model = $computed<any>({
  get: () => column.options ? (column.value ? column.value?.split(',') : []) : column.value,
  set: val => column.value = column.options ? (val?.join(',') || '') : val,
})
</script>

<template>
  <el-checkbox-group
    v-if="column.options"
    v-model="model"
    @update:model-value="$emit('getList')"
  >
    <el-checkbox
      v-for="i in options"
      :key="i.value"
      :label="`${i.value}`"
    >
      {{ i.label }}
    </el-checkbox>
  </el-checkbox-group>
  <el-checkbox
    v-else
    v-model="model"
    true-label="true"
    false-label="false"
    @update:model-value="$emit('getList')"
  />
</template>
