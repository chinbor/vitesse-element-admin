<script setup lang="ts">
const router = useRouter()

const redirect = $(useRouteQuery('redirect'))
redirect ? router.push(redirect as string) : router.go(-1)
</script>

<template>
  <div />
</template>

<route lang="yaml">
meta:
  permission: false
  hidden: true
</route>
