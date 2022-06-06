<script lang="ts">
export default {
  name: 'KeepAlive',
}
</script>

<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /system/user
component: ~/layouts/default.vue
meta:
  permission: true
  icon: ep:setting
  title: 系统管理
</route>
