export const system = useSystemStore()
system.getList()

export const user = useUserStore()
user.$subscribe((_, state) => {
  localStorage.setItem('token', state.token)
})

export const tagsView = useTagsviewStore()
tagsView.$subscribe((_, state) => {
  localStorage.setItem('visitedViews', JSON.stringify(state.visitedViews))
})
