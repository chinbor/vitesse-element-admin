import type { DirectiveBinding } from 'vue'
import { useUserStore } from '~/stores/user'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, modifiers: { disabled } } = binding
    if (!value)
      return
    const userStore = useUserStore()
    const hasPermission = userStore.hasPermission(value)
    if (hasPermission)
      return
    if (disabled) {
      el.style.setProperty('color', 'unset')
      el.style.pointerEvents = 'none'
      return
    }
    el.style.display = 'none'
  },
}
