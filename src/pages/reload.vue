<script setup lang="ts">
const router = useRouter()

onMounted(() => {
  router.go(-1)
})
</script>

<template>
  <div />
</template>

<route lang="yaml">
meta:
  permission: false
  layout: default
  hidden: true
</route>
