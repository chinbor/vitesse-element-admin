<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'
import { useRouteStore } from '~/stores/route'
const routeStore = useRouteStore()
</script>

<template>
  <el-menu :default-active="$route.meta.parent?.path || $route?.path" b-r-none="!" overflow-auto>
    <SidebarItem v-for="i in routeStore.sidebarList" :key="i.path" :route="i" />
  </el-menu>
</template>

<style scoped>
::v-deep(.el-menu-item.is-active) {
  background: linear-gradient(to left, var(--el-color-primary) 2%, transparent 2%);
  background-color: rgba(var(--el-color-primary-rgb) / 5%);
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
