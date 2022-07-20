import { useTagsViewStore } from '~/stores/tagsView'

export const settings = useSettingsStore()

export const user = useUserStore()
user.$subscribe((_, state) => {
  localStorage.setItem('token', state.token)
})

export const tagsView = useTagsViewStore()
tagsView.$subscribe((_, state) => {
  localStorage.setItem('visitedViews', JSON.stringify(state.visitedViews))
})
