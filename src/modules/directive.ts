import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, app }) => {
  if (isClient) {
    Object.entries(import.meta.globEager('../directive/*.ts')).forEach(([fileName, module]) => {
      app.directive?.(fileName.match(/.*\/(.*)\.ts$/)?.[1], module.default)
    })
  }
}
