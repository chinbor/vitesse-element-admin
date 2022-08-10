<script lang="ts" setup>
import { isFunction } from 'lodash-es'
import type { PropType } from 'vue'
import type { Column } from '~/composables/agGrid'
const { column } = defineProps({
  column: {
    type: Object as PropType<Column>,
    default: () => ({}),
  },
})

let page = $ref(1)
let lastPage = $ref(0)
let loading = $ref(false)
let inputValue = $ref('')
let options = $ref(isFunction(column.options) ? [] : column.options)
const optionValue = column.form?.optionValue || 'id'
const optionLabel = column.form?.optionLabel || 'name'

async function getList(label: string) {
  if (!isFunction(column.options))
    return []
  loading = true
  const { data, total } = await column.options({ page, pageSize: 50, status: true, [optionLabel]: label || undefined }).finally(() => loading = false)
  lastPage = Math.ceil(total / 50)
  return data.map((i: any) => ({ label: i[optionLabel], value: `${i[optionValue]}` }))
}

const onFilter = async (value = '') => {
  if (!isFunction(column.options) || loading)
    return
  page = 1
  options = await getList(inputValue = value)
}

const model = $computed<any>({
  get: () => column.form?.props.multiple ? (column.value ? column.value?.split(',') : []) : column.value,
  set: val => column.value = column.form?.props?.multiple ? (val?.join(',') || '') : val,
})
setTimeout(() =>
  model && onFilter(),
)

const getListInject = inject('getList', () => {})

const bottomRef = ref()
useIntersectionObserver(bottomRef, async ([{ isIntersecting }]) => {
  if (!isIntersecting)
    return
  if (!loading && page + 1 <= lastPage) {
    page++
    const data = await getList(inputValue)
    options.push(...data)
  }
})
</script>

<template>
  <el-select
    v-model="model"
    :loading="loading"
    collapse-tags
    clearable
    filterable
    remote
    v-bind="column.form?.props"
    :remote-method="onFilter"
    @visible-change="options.length || onFilter()"
    @clear="getListInject()"
    @update:model-value="getListInject()"
  >
    <el-option v-for="i in options" :key="i.value" :label="i.label" :value="`${i.value}`" />
    <div ref="bottomRef" />
  </el-select>
</template>
