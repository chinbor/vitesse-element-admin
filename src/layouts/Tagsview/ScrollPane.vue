<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'

const { tagList = [] } = defineProps<{ tagList: any[] }>()
const scrollContainer = $shallowRef<any>()

const scrollWrapper = $computed(() => scrollContainer.wrap$)
function handleScroll(e: WheelEvent) {
  scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + -e.deltaY
}

function moveToTarget(currentTag: RouteLocationNormalized) {
  const $container = scrollContainer.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper

  let firstTag = null
  let lastTag = null

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  }
  else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  }
  else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex(item => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth)
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft)
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
  }
}
defineExpose({
  moveToTarget,
})
</script>

<template>
  <el-scrollbar
    ref="scrollContainer"
    whitespace-nowrap flex-1 flex items-end
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<style scoped>
::v-deep(.el-scrollbar__wrap) {
  flex: 1;
  height: auto;
}

::v-deep(.el-scrollbar__bar) {
  bottom: -6px;
}
</style>
