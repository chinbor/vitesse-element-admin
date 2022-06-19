<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /question/history
component: ~/layouts/default.vue
meta:
  icon: fa-regular:question-circle
  title: 问卷管理
</route>
