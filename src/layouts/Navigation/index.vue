<script setup lang="ts">
import { uniqWith } from 'lodash-es'
import Palette from './Palette.vue'
import HeaderSearch from './HeaderSearch/index.vue'
import UserForm from '~/pages/system/user/components/VForm.vue'

const props = defineProps<{
  isCollapse: boolean
}>()
const isCollapse = useVModel(props, 'isCollapse')
watch(useBreakpoints({ tablet: 768 }).smaller('tablet'), (val) => {
  isCollapse.value = val
})

const { isFullscreen, toggle } = useFullscreen()
const showMenu = ref(false)

const route = useRoute()
const getMatched = computed(() =>
  uniqWith(
    [
      { path: '/', meta: { title: '首页' } },
      route.matched[0], ...route.meta?.matched || [],
      route.matched.at(-1)!,
    ],
    (a, b) => a.meta.title === b.meta.title,
  ).filter(i => i?.meta.title),
)
</script>

<template>
  <nav flex gap-3 items-center text-sm px-3>
    <i cursor-pointer :class="isCollapse ? 'i-line-md:menu-fold-right' : 'i-line-md:menu-fold-left'" @click="isCollapse = !isCollapse" />
    <el-breadcrumb mr-auto relative>
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="i in getMatched" :key="i.meta?.title">
          <router-link :to="tagsView.resolve(i)" cursor-pointer="!" font-400="!" @click.stop="tagsView.push(i)">
            {{ i.meta?.title }}
          </router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>

    <HeaderSearch />
    <Palette />
    <button btn text-sm :class="isFullscreen ? 'i-fa6-solid:compress' : 'i-fa6-solid:expand'" @click="toggle" />
    <el-dropdown>
      <div flex items-center gap-1 cursor-pointer>
        <i i-fa6-solid:circle-user text-xl text-gray-300 mx-1 />
        {{ user.userInfo.name }}
        <i i-fa-solid:sort-down self-start />
      </div>
      <template #dropdown>
        <el-dropdown-item mt="!1.5" @click="$router.push('/')">
          控制台
        </el-dropdown-item>
        <el-dropdown-item @click="showMenu = true">
          个人设置
        </el-dropdown-item>
        <el-dropdown-item divided mb="!1.5" @click="user.logout()">
          退出登陆
        </el-dropdown-item>
      </template>
    </el-dropdown>

    <UserForm v-if="showMenu" v-model="showMenu" :row="user.userInfo" />
  </nav>
</template>

<style>
  /* breadcrumb transition */
  .breadcrumb-enter-active {
    transition: all 0.25s;
  }

  .breadcrumb-enter-from,
  .breadcrumb-leave-to {
    opacity: 0;
    transform: translateX(30px) skewX(-50deg);
  }
</style>
