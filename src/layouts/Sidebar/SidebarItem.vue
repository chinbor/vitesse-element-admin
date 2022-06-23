<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
defineProps<{ route: RouteRecordRaw }>()

const tagsView = useTagsviewStore()
</script>

<template>
  <el-sub-menu v-if="route.children?.length" :index="$router.resolve(route).path">
    <template #title>
      <el-icon :class="route.meta?.icon" />
      <span>{{ route.meta?.title }}</span>
    </template>
    <SidebarItem v-for="i in route.children" :key="i.path" :route="i" />
  </el-sub-menu>
  <el-menu-item v-else :index="$router.resolve(route).path" @click="tagsView.push(route)">
    <el-icon :class="route.meta?.icon" />
    <template #title>
      {{ route.meta?.title }}
    </template>
  </el-menu-item>
</template>
