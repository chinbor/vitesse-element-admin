<script setup lang="ts">
import Sidebar from './Sidebar/index.vue'
import Tagsview from './Tagsview/index.vue'
import Navigation from './Navigation/index.vue'
import { useTagsviewStore } from '~/stores/tagsview'

const tagsViewStore = useTagsviewStore()
const isCollapse = $ref(false)
</script>

<template>
  <div text="gray-700 dark:gray-200" flex h-screen>
    <aside row-span-2 flex="~ col" b="0 r-1 r-zinc-200 dark:r-zinc-700" shadow-md z-3>
      <header h-12 flex items-center gap-2 px-3 cursor-pointer @click="$router.push('/')">
        <img src="/logo.png" w-8 ml-1>
        <div relative overflow-hidden>
          <transition enter-active-class="absolute" :duration="300" leave-active-class="absolute">
            <h1 v-if="!isCollapse">菜谱预点餐系统</h1>
          </transition>
        </div>
      </header>
      <Sidebar row-span-2 flex-1 :collapse="isCollapse" />
    </aside>

    <main flex-1 grid="~ rows-[3rem_34px_auto]" overflow-x-hidden>
      <Navigation v-model:isCollapse="isCollapse" />
      <Tagsview />
      <router-view v-slot="{ Component, route }">
        <transition mode="out-in" name="main" appear>
          <keep-alive :include="tagsViewStore.cachedViews" :max="20">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.main-enter-active {
  transition: 0.2s;
}

.main-leave-active {
  transition: 0.15s;
}

.main-enter-from {
  margin-left: -20px;
  opacity: 0;
}

.main-leave-to {
  margin-left: 20px;
  opacity: 0;
}
</style>
