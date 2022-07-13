import type { App } from 'vue'

export default (app: App) => {
  Object.entries(import.meta.globEager('../directive/*.ts')).forEach(([fileName, module]) => {
    const name = fileName.match(/.*\/(.*)\.ts$/)?.[1]
    name && app.directive?.(name, module.default)
  })
}
