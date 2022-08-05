import type { App } from 'vue'

export default (app: App) => {
  Object.entries(import.meta.glob<{ default: any }>('../directive/*.ts', { eager: true })).forEach(([fileName, module]) => {
    const name = fileName.match(/.*\/(.*)\.ts$/)?.[1]
    name && app.directive?.(name, module.default)
  })
}
