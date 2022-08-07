<script setup lang="ts" name="nested-menu2">
const model = ref()
</script>

<template>
  <div m-3>
    <el-input v-model="model" :placeholder="$route.meta.title" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 菜单2
</route>
