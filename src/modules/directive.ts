import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, app }) => {
  if (isClient) {
    Object.entries(import.meta.globEager('../directive/*.ts')).forEach(([fileName, module]) => {
      const name = fileName.match(/.*\/(.*)\.ts$/)?.[1]
      name && app.directive?.(name, module.default)
    })
  }
}
