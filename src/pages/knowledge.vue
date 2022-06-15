<script lang="ts">
export default {
  name: 'KeepAlive',
}
</script>

<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /knowledge/type
component: ~/layouts/default.vue
meta:
  icon: material-symbols:menu-book-outline
  title: 知识管理
</route>
