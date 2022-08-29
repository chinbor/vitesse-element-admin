<script lang="ts" setup>
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const route = useRoute()
const router = createRouter({
  history: createWebHistory(),
  routes,
})
const isPermission = router.resolve(route.path).name !== 'all'
</script>

<template>
  <div h="80vh" w-screen text-center grid="~ cols-2" items-center justify-center gap-20>
    <i w-md h-md :class="isPermission ? 'i-custom:403' : 'i-custom:404'" justify-self-end />

    <div text-left w-55>
      <div text-3xl text-blue-5 font-600>
        {{ isPermission ? `403 Forbidden` : `404 Not Found` }}
      </div>

      <div text-sm mb-10 text-gray-4>{{ route.path }}</div>

      <h1 mb-1 font-5 text-lg>
        {{ isPermission ? '暂无访问权限...' : '没有这个页面...' }}
      </h1>

      <div text-sm text-gray-4>
        {{ isPermission
          ? '请联系管理员添加权限，或使用有权限的用户重新登陆。'
          : '请检查您输入的网址是否正确，或点击下方按钮返回首页。'
        }}
      </div>

      <button
        mt-10 px-4 py-2 bg-blue-5 text-white rounded-full text-sm
        @click="isPermission ? user.logout() : $router.push('/')"
      >
        {{ isPermission ? '重新登陆' : '返回首页' }}
      </button>
      <button
        ml-2 px-4 py-2 text-blue-5 rounded-full text-sm
        @click="$router.back()"
      >
        返回
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
</route>
