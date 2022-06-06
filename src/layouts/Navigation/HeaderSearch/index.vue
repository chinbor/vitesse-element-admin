<script lang="ts" setup>
import { useSuggestionsFocus } from './useSuggestionsFocus'
import { useSearchSuggestions } from './useSearchSuggestions'
import { useRouteStore } from '~/stores/route'
import { useTagsviewStore } from '~/stores/tagsview'

const routeStore = useRouteStore()
const tagsView = useTagsviewStore()

const input = ref<HTMLInputElement | null>(null)
const isActive = $ref(false)
const query = ref('')
const maxSuggestions = ref(5)

const suggestions = useSearchSuggestions({
  searchList: routeStore.list,
  query,
  maxSuggestions,
})

const { focusIndex, focusNext, focusPrev }
      = useSuggestionsFocus(suggestions)

const showSuggestions = $computed(
  () => isActive && !!suggestions.value.length,
)

const goTo = (index: number): void => {
  if (!showSuggestions)
    return

  const suggestion = suggestions.value[index]
  if (!suggestion)
    return

  tagsView.push(suggestion.name)
  query.value = ''
  focusIndex.value = 0
}
</script>

<template>
  <form class="search-box" relative flex gap-1 lt-md:mr-2 items-center role="search">
    <label fa6-solid:magnifying-glass for="search" btn text-sm />
    <input
      id="search"
      ref="input"
      v-model="query"
      placeholder="搜索"
      autocomplete="off"
      spellcheck="false"
      w-32 focus:w-40 lt-md="cursor-pointer w-0 -mr-3"
      b="0 b-1 gray-300 dark:gray-500 !focus:primary" leading-8 outline-none bg-transparent transition="all ease duration-300"
      @input="focusIndex = 0"
      @focus="isActive = true"
      @blur="isActive = false"
      @keydown.prevent.up="showSuggestions && focusPrev()"
      @keydown.prevent.down="showSuggestions && focusNext()"
      @keydown.prevent.enter="goTo(focusIndex)"
    >
    <ul
      v-if="showSuggestions"
      z-3 absolute top-10 left-0 min-w-65 p-2 list-none bg="white dark:zinc-800"
      b="~ gray-200 dark:gray-500" rounded
      @mouseleave="focusIndex = -1"
    >
      <li
        v-for="({ name, meta }, index) in suggestions"
        :key="index"
        p="3" cursor-pointer rounded
        :class="focusIndex === index ? 'bg-gray-100 dark:bg-gray-600' : ''"
        @mouseenter="focusIndex = index"
        @mousedown="goTo(index)"
      >
        <div whitespace-nowrap @click="tagsView.push(name)" v-html="meta?.title" />
      </li>
    </ul>
  </form>
</template>
