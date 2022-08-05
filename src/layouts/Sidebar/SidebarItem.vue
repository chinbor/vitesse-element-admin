<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
defineProps<{ route: RouteRecordRaw }>()
</script>

<template>
  <el-sub-menu v-if="route.children?.length" :index="route.meta?.title!">
    <template #title>
      <el-icon><i :class="route.meta?.icon" /></el-icon>
      <span>{{ route.meta?.title }}</span>
    </template>
    <SidebarItem v-for="i in route.children" :key="i.path" :route="i" />
  </el-sub-menu>
  <el-menu-item v-else :index="route.meta?.title" @click="tagsView.push(route)">
    <el-icon><i :class="route.meta?.icon" /></el-icon>
    <template #title>
      {{ route.meta?.title }}
    </template>
  </el-menu-item>
</template>
