<script lang="ts" setup>
import type { IHeaderParams } from 'ag-grid-community'
import type { ColumnDef } from '~/composables/agGrid'

const { params } = defineProps<{
  params: IHeaderParams
}>()

const columnStoreList = computed<ColumnDef[]>(() =>
  params.context.columnStoreList.filter((i: ColumnDef) => !i.suppressHide),
)

function change(column: ColumnDef, val: boolean) {
  params.columnApi?.setColumnVisible(column.field, val)
  params.context.autoSizeAll()
  column.hide = !val
}
</script>

<template>
  <el-dropdown class="table-set" w-full :hide-on-click="false">
    <div flex justify-between items-center @click="params.context.autoSizeAll()">
      {{ params.displayName }}
      <i i-fa6-solid:gear cursor-pointer />
    </div>
    <template #dropdown>
      <el-dropdown-item>
        <el-button type="primary" w-full @click="params.context.initStorage()">
          恢复默认
        </el-button>
      </el-dropdown-item>
      <el-dropdown-item v-for="i in columnStoreList" :key="i.field">
        <el-checkbox
          :model-value="!i.hide"
          :label="params.columnApi.getColumn(i.field)?.getColDef().headerName"
          @update:model-value="change(i, !!$event)"
        />
      </el-dropdown-item>
    </template>
  </el-dropdown>
</template>

<style>
.table-set .el-tooltip__trigger {
  width: 100%;
}

[col-id="actions"].ag-header-cell {
  padding: 0 10px;
}
</style>
