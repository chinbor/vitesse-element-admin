<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import routes from '~pages'

const route = useRoute()
const isPermissionFn = (routes: RouteRecordRaw[] = [], parent: any = { path: '' }) => {
  for (const i of routes) {
    const path = i.path.startsWith('/') ? i.path : `${parent.path}/${i.path}`
    if (path === route.path || isPermissionFn(i.children, i))
      return true
  }
}
const isPermission = isPermissionFn(routes)
</script>

<template>
  <div h="80vh" w-screen text-center grid="~ cols-2" items-center justify-center gap-20>
    <i w-md h-md :class="isPermission ? 'i-custom:403' : 'i-custom:404'" justify-self-end />

    <div text-left w-54>
      <div text-3xl text-blue-5 font-600>
        {{ isPermission ? `403 Forbidden` : `404 Not Found` }}
      </div>

      <h1 mt-10 mb-3 font-500 text-lg>
        {{ isPermission ? '暂无访问权限...' : '没有这个页面...' }}
      </h1>

      <div text-sm text-gray-400>
        {{ isPermission
          ? '请联系管理员添加权限，或点击下方按钮重新登陆。'
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
