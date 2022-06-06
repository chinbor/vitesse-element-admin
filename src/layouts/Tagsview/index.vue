<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'
import draggable from 'vuedraggable'
import ScrollPane from './ScrollPane.vue'
import { useTagsviewStore } from '~/stores/tagsview'

const tagsView = useTagsviewStore()
tagsView.$subscribe((_, state) => {
  localStorage.setItem('visitedViews', JSON.stringify(state.visitedViews))
})

const route = useRoute()
const router = useRouter()

watch(() => route.fullPath, () => {
  tagsView.addView(route)
  moveToCurrentTag()
}, { immediate: true })

const tags = $shallowRef<{ to: RouteLocationNormalized }[]>([])
const scrollPaneRef = $shallowRef<any>()
async function moveToCurrentTag() {
  await nextTick()
  if (!tags.length)
    return
  const tag = tags.find((i: any) => i.to?.path === route.path)
  if (tag)
    scrollPaneRef.moveToTarget(tag)
}

function toLastView() {
  const latestView = tagsView.visitedViews.slice(-1)[0]
  if (latestView)
    router.push(latestView)
  else
    router.push('/')
}

function closeTag(view: RouteLocationNormalized) {
  tagsView.dropView(view)

  if (view.name === route.name)
    toLastView()
}

const selectedTag = $computed(() => {
  const tag = tags.find((i: any) => i.to?.path === route.path) || tags[0]
  return tag?.to
})
function closeOthersTags() {
  router.push(selectedTag)
  tagsView.delOthersViews(selectedTag)
  moveToCurrentTag()
}

function closeAllTags() {
  tagsView.delOthersViews()

  toLastView()
}
</script>

<template>
  <div px-1 bg="gray-200 dark:zinc-800" overflow-auto relative flex flex-nowrap z-2>
    <scroll-pane ref="scrollPaneRef" :tag-list="tags">
      <draggable
        v-model="tagsView.visitedViews"
        item-key="path"
        animation="200"
        class="flex gap-1 px-2.5 flex-1"
      >
        <template #item="{ element: tag, index: i }">
          <span
            :ref="(val:any) => { if (val){ val.to = tag;tags[i] = val } }"
            :class="{ active: tag.name === route.name }"
            class="tab-item"
            @click="tagsView.push(tag.name)"
          >
            <span class="split" absolute left="-6px" z="-1" text-gray-500>｜</span>
            {{ tag.meta.title }}
            {{ tag.query?.titleLabel ? ` : ${tag.query?.titleLabel}` : '' }}
            <span ml-1 text-xs flex items-center hover:bg-gray-300 rounded-full>
              <i ic:baseline-close @click.prevent.stop="closeTag(tag)" />
            </span>
          </span>
        </template>
      </draggable>
    </scroll-pane>
    <el-dropdown bg="white dark:zinc-600" px-1 rounded my-auto mr-2 shadow cursor-pointer>
      <i text-xs mt=".5" fa6-solid:angle-down />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="tagsView.push(selectedTag.name)">
            刷新
          </el-dropdown-item>
          <el-dropdown-item @click="closeTag(selectedTag)">
            关闭
          </el-dropdown-item>
          <el-dropdown-item @click="closeOthersTags">
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item @click="closeAllTags">
            关闭全部
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.tab-item {
  --color: transparent;

  @apply relative text-sm h-7 cursor-pointer rounded-t-lg -mx-0.75
    relative inline-flex items-center px-3 bg-[var(--color)] transition-colors;

  &::before,
  &::after {
    @apply absolute bottom-0 content-none rounded-full w-5 h-5 transition-all;

    box-shadow: 0 0 0 4px var(--color);
  }

  &::before {
    @apply -left-5;

    clip-path: inset(50% -10px 0 50%);
  }

  &::after {
    @apply -right-5;

    clip-path: inset(50% 50% 0 -10px);
  }

  &:hover {
    --color: #f3f4f6;

    .dark & {
      --color: #52525b;
    }
  }

  &:first-child .split {
    @apply hidden;
  }

  &.active {
    --color: white;

    .dark & {
      --color: #18181b;
    }

    @apply z-1;

    .split {
      @apply hidden;
    }
  }
}
</style>
