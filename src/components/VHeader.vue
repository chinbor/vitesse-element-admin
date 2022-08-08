<script setup lang="ts">
defineProps<{
  title?: string
  back?: boolean
}>()
</script>

<template>
  <div min-h-14 flex items-center shadow p-3 bg="white dark:zinc-900" z-1>
    <div v-if="!back" bg-primary rounded w-2 h-full mr-3 />
    <i v-else mr-3 hover:text-primary text-sm cursor-pointer i-fa6-solid:arrow-left dense round flat @click="tagsView.goBack()" />
    <div flex items-center font-medium mr-auto cursor-pointer hover:text-primary @click="tagsView.push($route)">
      {{ title || $route.meta?.title }}
      {{ $route.query?.pageTitle ? ` : ${$route.query?.pageTitle}` : '' }}
      <i ml-1 text-xs i-fa6-solid:rotate-right />
    </div>

    <slot />
  </div>
</template>
