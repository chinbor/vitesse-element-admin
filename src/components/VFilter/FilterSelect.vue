<script lang="ts" setup>
import type { ColumnDef, Option } from '~/composables/agGrid'
const { column } = defineProps<{
  column: ColumnDef
}>()
defineEmits(['getList'])

let page = $ref(1)
let lastPage = $ref(0)
let options = $ref<Option[]>([])
async function getList(query: string) {
  if (Array.isArray(column.options))
    return column.options.filter(i => i.label.includes(query))

  const { data, total } = await column.options!(query || undefined, {
    page,
    pageSize: settings.pageSize,
  })
  lastPage = Math.ceil(total / settings.pageSize)
  return data
}

let loading = $ref(false)
let query = $ref('')
const remoteMethod = async (value = '') => {
  loading = true
  page = 1
  options = await getList(query = value)
  loading = false
}

let stop = () => {}
const bottomRef = ref()
const isLastPage = $computed(() => Array.isArray(column.options) || (page === lastPage && options.length))
async function visibleChange(visible: boolean) {
  if (!visible) {
    if (query) {
      query = ''
      options = []
    }
    return stop()
  }

  if (!options.length)
    remoteMethod()

  await new Promise(resolve => setTimeout(resolve, 50))
  ;({ stop } = useIntersectionObserver(bottomRef, async ([{ isIntersecting }]) => {
    if (isIntersecting && !isLastPage) {
      page++
      options.push(...await getList(query))
    }
  }))
}

setTimeout(() => {
  column.value?.length && remoteMethod()
  if (column.filterProps.multiple && !Array.isArray(column.value))
    column.value = [column.value]
})
</script>

<template>
  <el-select
    v-model="column.value"
    collapse-tags
    :loading="loading"
    default-first-option
    filterable
    remote
    :remote-method="remoteMethod"
    class="!w-48"
    @visible-change="visibleChange"
    @clear="$emit('getList')"
    @update:model-value="$emit('getList')"
  >
    <el-option v-for="i in options" :key="i.value" :label="i.label" :value="`${i.value}`" />
    <el-option v-if="!isLastPage" ref="bottomRef" disabled :value="-1" flex justify-center items-center>
      加载更多 <i animate-spin animate-duration-2000 i-ep:loading />
    </el-option>
  </el-select>
</template>
