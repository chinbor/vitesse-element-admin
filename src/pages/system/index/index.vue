<script setup lang="ts" name="system-index">
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'
import SystemItem from './components/SystemItem.vue'
import type { System } from './api'
import { getSystemList, put } from './api'

let list = $ref<System[]>([])
async function getList() {
  const { data } = await getSystemList()
  list = data.map(i => ({ ...i, modelValue: cloneDeep(i.value) }))
}
getList()

async function submit() {
  await Promise.all(list.filter(i => !isEqual(i.value, i.modelValue)).map(i => put(i)))
  ElMessage.success('修改成功')
  getList()
}
</script>

<template>
  <div layout>
    <VHeader />
    <el-tabs type="border-card" m-3 flex-1 overflow-auto>
      <el-tab-pane label="基本设置">
        <el-form label-position="top" label-width="auto" w="1/2" @submit.prevent="submit">
          <SystemItem v-for="i in list " :key="i.id" v-bind="i" v-model="i.modelValue" />
          <el-form-item>
            <el-button type="primary" native-type="submit">确认提交</el-button>
            <el-button @click="getList">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.el-tabs__header.is-top {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>

<route lang="yaml">
meta:
  title: 系统设置
  order: 1
</route>
