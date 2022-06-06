<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { useUserStore } from './stores/user'
import { isDark } from '~/composables'

useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
})

const userStore = useUserStore()
userStore.$subscribe((_, state) => {
  localStorage.setItem('token', state.token)
  localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
})

// @ts-expect-error ignore
const safeList = ['ep:food', 'ep:user', 'ep:setting']
</script>

<template>
  <RouterView />
</template>
