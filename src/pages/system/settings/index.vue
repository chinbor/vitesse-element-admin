<script setup lang="ts" name="system-settings">
import { ElMessage } from 'element-plus'
import { isEqual } from 'lodash-es'
import SystemItem from './components/SystemItem.vue'
import { put } from './api'

settings.getList()

async function submit() {
  await Promise.all(settings.list.filter(i => !isEqual(i.value, i.originValue)).map(put))
  ElMessage.success('修改成功')
  settings.getList()
}

const model = $computed(() =>
  settings.list.reduce((a: any, b: any) => (a[b.id] = b.value, a), {}),
)
</script>

<template>
  <div layout>
    <VHeader />

    <el-tabs type="border-card" m-3 flex-1 overflow-auto>
      <el-tab-pane label="基础设置">
        <el-form :model="model" label-position="top" label-width="auto" w="1/2" @submit.prevent="submit">
          <SystemItem v-for="i in settings.list " :key="i.id" v-bind="i" v-model:value="i.value" />
          <el-form-item v-permission="'/settings/[id]/put'">
            <el-button type="primary" native-type="submit">确认提交</el-button>
            <el-button @click="settings.getList">取消</el-button>
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
  permission:
    - title: 列表
      permission: /settings
    - title: 修改
      permission: /settings/[id]/put
</route>
