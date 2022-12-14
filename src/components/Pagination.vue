<script lang="ts" setup>
const {
  pageSizes = [10, 50, 100, 200],
  layout = 'total, sizes, prev, pager, next, jumper',
  background = true,
} = defineProps<{
  pageSizes?: number[]
  layout?: string
  background?: boolean
}>()

const getList = inject('getList', () => {})

let page = $(useRouteQuery<number>('page', 1))
watch(() => page, () => getList())

const pageSize = $(useRouteQuery<number>('pageSize', settings.pageSize))
watch(() => pageSize, () => getList())

const total = $(inject('total', ref(0)))
watchEffect(() => {
  const max = Math.ceil(total / pageSize)
  if (max && page > max)
    page = max
})

const selectedList = $(inject('selectedList', ref([])))
const list = $(inject('list', ref([])))
const isSelectAll = computed(() =>
  !selectedList.length ? false : selectedList.length === list.length,
)
const selectAll = inject('selectAll', () => {})
const deselectAll = inject('deselectAll', () => {})
</script>

<template>
  <div flex items-center overflow-auto>
    <div v-if="$slots.default && list.length" flex items-center mr-auto>
      <el-checkbox
        class="!mr-1"
        :model-value="isSelectAll"
        :indeterminate="selectedList.length > 0 && selectedList.length < list.length"
        @change="() => isSelectAll ? deselectAll() : selectAll() "
      >
        <span>{{ isSelectAll ? '取消' : '全选' }}</span>
      </el-checkbox>
      <slot />
      <span v-if="selectedList.length" text="sm gray-500 dark:gray-200" whitespace-nowrap>
        {{ `已选择 ${selectedList.length} 条` }}
      </span>
    </div>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      ml-auto
      :class="{ 'flex-1': !($slots.default && list.length) }"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
    />
  </div>
</template>

<style>
.el-pagination.flex-1 .is-first {
  margin-right: auto;
}
</style>
