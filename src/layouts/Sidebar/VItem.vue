<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useTagsviewStore } from '~/stores/tagsview'
defineProps<{ route: RouteRecordRaw }>()

const tagsView = useTagsviewStore()
</script>

<template>
  <el-sub-menu v-if="route.children?.length" :index="route.name">
    <template #title>
      <el-icon :class="route.meta?.icon" />
      <span>{{ route.meta?.title }}</span>
    </template>
    <VItem v-for="i in route.children" :key="i.path" :route="i" />
  </el-sub-menu>
  <el-menu-item v-else :index="route.name" @click="tagsView.push(route.name)">
    <el-icon :class="route.meta?.icon" />
    <template #title>
      {{ route.meta?.title }}
    </template>
  </el-menu-item>
</template>
