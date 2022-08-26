import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, modifiers: { disabled } } = binding
    if (hasPermission(value))
      return

    if (disabled) {
      el.style.setProperty('color', 'unset')
      el.style.pointerEvents = 'none'
      return
    }

    el.style.display = 'none'
  },
}
