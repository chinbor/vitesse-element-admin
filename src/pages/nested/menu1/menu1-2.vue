<script setup lang="ts" name="nested-menu1-menu1-2">
const model = ref()
</script>

<template>
  <div m-3>
    <el-input v-model="model" :placeholder="$route.meta.title" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 菜单1-2
</route>
