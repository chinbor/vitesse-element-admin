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
  layout: default
  hidden: true
</route>
