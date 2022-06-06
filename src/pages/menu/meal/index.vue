<script setup lang="tsx" name="meal">
import { AgGridVue } from 'ag-grid-vue3'
import { getFoodList } from '../food/api'
import { type Meal, getMealList } from './api'
import { useAgGrid } from '~/composables'
import { getUserList } from '~/pages/system/user/api'

const { agGridBind, agGridOn } = useAgGrid<Meal>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '姓名', field: 'userName', value: '', options: ({ value: username, ...params }) =>
      getUserList({ ...params, username }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.username, value: i.id })),
        total,
      })) },
    { headerName: '菜品', field: 'foodName', value: '', options: ({ value: name, ...params }) =>
      getFoodList({ ...params, name }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.name, value: i.id })),
        total,
      })),
    },
  ],
  getMealList,
)
</script>

<template>
  <div flex="~ col nowrap" bg="zinc-100 dark:zinc-800">
    <VHeader />

    <div m-3 p-3 pb-2 bg="white dark:zinc-900" shadow rounded flex="~ 1 col" gap-2>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
name: meal
meta:
  title: 预报餐管理
  order: 4
</route>
