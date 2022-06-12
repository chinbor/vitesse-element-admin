<script setup lang="ts">
import VItem from './VItem.vue'
import { useRouteStore } from '~/stores/route'
const routeStore = useRouteStore()

const $route = useRoute()
const defaultActive = computed(() => {
  const route = $route.matched.at(-2)
  return ($route.meta?.hidden ? route?.name : $route.name) as string
})
</script>

<template>
  <el-menu :default-active="defaultActive" b-r-none="!" overflow-auto>
    <VItem v-for="i in routeStore.sidebarList" :key="i.path" :route="i" />
  </el-menu>
</template>

<style scoped>
::v-deep(.el-menu-item.is-active) {
  background: linear-gradient(to left, var(--el-color-primary) 2%, transparent 2%);

  @apply bg-zinc-100 dark:bg-zinc-800;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
