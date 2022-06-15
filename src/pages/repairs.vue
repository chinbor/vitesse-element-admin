<script lang="ts">
export default {
  name: 'KeepAlive',
}
</script>

<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /repairs/index
component: ~/layouts/default.vue
meta:
  icon: ic:outline-handyman
  title: 报修管理
</route>
