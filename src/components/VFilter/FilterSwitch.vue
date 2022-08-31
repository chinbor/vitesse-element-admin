<script lang="ts" setup>
import type { PropType } from 'vue'
import type { ColumnDef } from '~/composables/agGrid'
defineProps({
  column: {
    type: Object as PropType<ColumnDef>,
    default: () => ({}),
  },
})
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
