import 'pinia'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

declare interface Window {
  // extend the window
}

// with vite-plugin-md, markdown files can be treated as Vue components
declare module '*.md' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    hidden?: boolean
    permission?: string | true
    title?: string
    label?: string
    class?: string
    order?: number
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
    route: RouteLocationNormalizedLoaded
  }
}
