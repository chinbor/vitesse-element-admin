<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
defineProps<{ route: RouteRecordRaw }>()
</script>

<template>
  <el-sub-menu v-if="route.children?.length" :index="route.path">
    <template #title>
      <el-icon><i :class="route.meta?.icon" /></el-icon>
      <span>{{ route.meta?.title }}</span>
    </template>
    <SidebarItem v-for="i in route.children" :key="i.path" :route="i" />
  </el-sub-menu>
  <el-menu-item v-else :index="route.path" @click="tagsView.push(route)">
    <el-icon><i :class="route.meta?.icon" /></el-icon>
    <template #title>
      <router-link :to="route" @click.capture.prevent>
        {{ route.meta?.title }}
      </router-link>
    </template>
  </el-menu-item>
</template>
