<script setup lang="ts">
import Sidebar from './Sidebar/index.vue'
import Tagsview from './Tagsview/index.vue'
import Navigation from './Navigation/index.vue'

const isCollapse = $ref(false)
</script>

<template>
  <div text="gray-700 dark:gray-200" flex h-screen>
    <aside row-span-2 flex="~ col" b="0 r-1 r-zinc-200 dark:r-zinc-700" shadow-md z-3>
      <header h-12 flex items-center shadow-sm z-1 px-3 cursor-pointer @click="$router.push('/')">
        <img :src="system.logo" w-8 mx-1>
        <div relative overflow-hidden>
          <transition enter-active-class="absolute" :duration="300" leave-active-class="absolute">
            <h1 v-if="!isCollapse" ml-1 text-primary>{{ system.name }}</h1>
          </transition>
        </div>
      </header>
      <Sidebar row-span-2 flex-1 :collapse="isCollapse" />
    </aside>

    <main flex-1 grid="~ rows-[3rem_34px_auto]" relative overflow-x-hidden>
      <Navigation v-model:isCollapse="isCollapse" />
      <Tagsview />
      <RouterView v-slot="{ Component, route }">
        <Transition mode="out-in" name="main" appear>
          <KeepAlive :include="tagsView.cachedViews" :max="20">
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.main-leave-active,
.main-enter-active {
  position: absolute;
  top: 82px;
  right: 0;
  bottom: 0;
  left: 0;
  transition: 0.15s;
}

.main-enter-active {
  transition: 0.2s;
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
