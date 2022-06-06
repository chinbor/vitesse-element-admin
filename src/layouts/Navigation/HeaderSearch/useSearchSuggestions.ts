import type { ComputedRef, Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { highlightText, isQueryMatched } from './isQueryMatched'

export const useSearchSuggestions = ({
  searchList,
  query,
  maxSuggestions,
}: {
  searchList: RouteRecordRaw[]
  query: Ref<string>
  maxSuggestions: Ref<number>
}): ComputedRef<RouteRecordRaw[]> => {
  return computed(() => {
    const searchStr = query.value.trim().toLowerCase()
    if (!searchStr)
      return []

    const suggestions: RouteRecordRaw[] = []

    const matchPageHeader = (
      searchItem: RouteRecordRaw,
      parent?: RouteRecordRaw,
    ): void => {
      if (suggestions.length >= maxSuggestions.value)
        return

      if (isQueryMatched(searchStr, [searchItem.path, searchItem.meta?.title || ''])) {
        const title = highlightText((parent ? `${parent.meta?.title} / ` : '') + searchItem.meta?.title, searchStr)
        suggestions.push({ ...searchItem, meta: { title } })
      }

      searchItem.children?.forEach(child =>
        matchPageHeader(child, searchItem),
      )
    }

    searchList.forEach(searchItem =>
      matchPageHeader(searchItem),
    )

    return suggestions
  })
}
