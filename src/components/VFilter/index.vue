<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import type { FormInstance } from 'element-plus'
import FilterInput from './FilterInput.vue'
import FilterSelect from './FilterSelect.vue'
import FilterRadio from './FilterRadio.vue'
import FilterSwitch from './FilterSwitch.vue'
import FilterCheckbox from './FilterCheckbox.vue'
import FilterDate from './FilterDate.vue'
import type { ColumnDef } from '~/composables/agGrid'

const columnDefs = inject('columnDefs', ref<ColumnDef[]>([]))
const columnList = $computed(() =>
  columnDefs.value.filter(i => Reflect.has(i, 'value') && !i.hide),
)

const getListInject = inject('getList', (_: any) => {})
function getList() {
  getListInject({ page: 1 })
}

const formRef = $ref<FormInstance>()
function reset() {
  formRef.resetFields()
  getList()
}

const extendRef = shallowRef()
const maxHeight = ref('')
useResizeObserver(extendRef, ([entry]) => {
  maxHeight.value = `${entry.target.scrollHeight}px`
})
const columnRef = $ref<any[]>([])
let extendable = $ref(false)
const extended = $ref(false)
const route = useRoute()
onMounted(() => {
  columnList.forEach((column) => {
    column.value = route.query?.[column.field] || column.value
  })

  useIntersectionObserver(columnRef[columnRef.length - 1], ([{ isIntersecting }]) => {
    if (!extended)
      extendable = !isIntersecting
  })
})
</script>

<template>
  <el-form v-if="columnList.length" ref="formRef" flex="~ nowrap" :model="columnList" label-position="left" @submit.prevent="getList" @reset.prevent="reset">
    <div ref="extendRef" class="v-extend gap-x-5" :class="{ extended }">
      <el-form-item
        v-for="(column, i) in columnList"
        :key="column.field"
        :ref="(e:any) => (columnRef[i] = e)"
        :prop="`${i}.value`"
        :label="column.headerName"
      >
        <component
          :is="column.filterType === 'switch' ? FilterSwitch
            : column.filterType === 'checkbox' ? FilterCheckbox
              : column.filterType === 'date' ? FilterDate
                : column.options ? column.filterType === 'radio'
                  ? FilterRadio : FilterSelect
                  : FilterInput"
          clearable
          v-bind="column.filterProps"
          :column="column"
          @get-list="getList"
        />
      </el-form-item>
    </div>

    <div ml-auto flex="~ nowrap" self-start items-center whitespace-nowrap>
      <slot v-bind="{ getList }">
        <el-button v-if="extendable || extended" type="primary" text mr="-3" @click="extended = !extended">
          <template #icon>
            <i :class="extended ? 'i-ep:arrow-up-bold' : 'i-ep:arrow-down-bold'" />
          </template>
          {{ extended ? '收起' : '更多' }}
        </el-button>
        <el-button native-type="reset">重置</el-button>
        <el-button type="primary" native-type="submit">查询</el-button>
      </slot>
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
.v-extend {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  max-height: 34px;
  overflow: hidden;
  transition: max-height 0.25s;

  &.extended {
    max-height: v-bind(maxHeight);
  }
}
</style>
