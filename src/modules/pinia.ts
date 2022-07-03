import { createPinia } from 'pinia'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ isClient, initialState, app, router }) => {
  const pinia = createPinia()
  pinia.use(({ store }) => {
    store.router = router
    store.route = router.currentRoute as any
  })
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  if (isClient)
    pinia.state.value = (initialState.pinia) || {}

  else
    initialState.pinia = pinia.state.value

  const userStore = useUserStore()
  userStore.$subscribe((_, state) => {
    localStorage.setItem('token', state.token)
    localStorage.setItem('userId', state.userId)
  })
}
