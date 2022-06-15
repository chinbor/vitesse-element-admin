<script lang="ts">
export default {
  name: 'KeepAlive',
}
</script>

<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /person/staff
component: ~/layouts/default.vue
meta:
  icon: fa-regular:question-circle
  title: 问卷管理
</route>
