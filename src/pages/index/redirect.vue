<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const redirect = $(useRouteQuery('redirect'))
redirect ? router.push(redirect as string) : router.go(-1)

onBeforeRouteLeave((to) => {
  useTagsViewStore().dropCachedView(to)
})
</script>

<template>
  <div />
</template>

<route lang="yaml">
meta:
  permission: false
  hidden: true
</route>
