import type { Ref } from 'vue'
import { computed, nextTick, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MaybeRef } from '@vueuse/shared'

export interface ReactiveRouteOptions {
  /**
   * Mode to update the router query, ref is also acceptable
   *
   * @default 'replace'
   */
  mode?: MaybeRef<'replace' | 'push'>

  /**
   * Route instance, use `useRoute()` if not given
   */
  route?: ReturnType<typeof useRoute>

  /**
   * Router instance, use `useRouter()` if not given
   */
  router?: ReturnType<typeof useRouter>
}

export function useRouteQuery(name: string): Ref<null | string | string[]>
export function useRouteQuery<T extends null | undefined | string | number | string[] = null | string | number | string[]>(name: string, defaultValue?: T, options?: ReactiveRouteOptions): Ref<T>
export function useRouteQuery<T extends string | string[]>(
  name: string,
  defaultValue?: T,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: ReactiveRouteOptions = {},
) {
  const routeName = route.name
  const result = computed({
    get() {
      if (routeName !== route.name)
        return result.value
      const data = route.query[name]
      if (data == null)
        return defaultValue ?? null
      if (Array.isArray(data))
        return data.filter(Boolean)

      if (typeof defaultValue === 'number')
        return Number(data)
      return data
    },
    set(v) {
      if (routeName !== route.name)
        return
      nextTick(() => {
        router[unref(mode)]({ query: { ...route.query, [name]: v === defaultValue || v === null ? undefined : v } })
      })
    },
  }) as any
  return result
}
