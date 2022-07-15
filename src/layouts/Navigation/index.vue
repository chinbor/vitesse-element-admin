<script setup lang="ts">
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
  [route.matched[0], ...route.meta?.matched || [], route.matched.at(-1)!]
    .filter(i => i?.meta.title),
)
</script>

<template>
  <nav flex gap-3 items-center text-sm px-3>
    <i cursor-pointer :class="isCollapse ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'" @click="isCollapse = !isCollapse" />
    <el-breadcrumb mr-auto relative>
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <transition-group v-if="$route.path !== '/'" name="breadcrumb" appear>
        <el-breadcrumb-item v-for="i in getMatched" :key="i.meta?.title" :to="tagsView.resolve(i)">
          {{ i.meta?.title }}
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>

    <HeaderSearch />
    <Palette />
    <button btn text-sm :class="isFullscreen ? 'fa6-solid:compress' : 'fa6-solid:expand'" @click="toggle" />
    <el-dropdown>
      <div flex items-center gap-1 cursor-pointer>
        <i fa6-solid:circle-user text-xl text-gray-300 mx-1 />
        {{ user.userInfo.name }}
        <i fa-solid:sort-down self-start />
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
    <UserForm v-if="showMenu" :id="user.userInfo.id" v-model:show="showMenu" />
  </nav>
</template>

<style>
  .el-breadcrumb__inner {
    font-weight: normal !important;
  }

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
