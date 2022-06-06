<script setup lang="ts">
import VItem from './VItem.vue'
import { useRouteStore } from '~/stores/route'
const routeStore = useRouteStore()
</script>

<template>
  <el-menu :default-active="$route.name" b-r-none="!" overflow-auto>
    <VItem v-for="i in routeStore.list" :key="i.path" :route="i" />
  </el-menu>
</template>

<style scoped>
::v-deep(.el-menu-item.is-active) {
  background: linear-gradient(to left, var(--el-color-primary) 2%, transparent 2%);

  @apply bg-blue-50 dark:bg-gray-800;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
