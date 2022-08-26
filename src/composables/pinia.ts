export const settings = useSettingsStore()

export const user = useUserStore()
user.$subscribe((_, state) => {
  localStorage.setItem('token', state.token)
}, { immediate: true })

export const tagsView = useTagsViewStore()
tagsView.$subscribe((_, state) => {
  localStorage.setItem(
    'visitedViews',
    JSON.stringify(
      // 删除matched 防止JSON.stringify 格式化报错
      state.visitedViews.map(i => ({
        ...i, matched: [],
      })),
    ),
  )
}, { immediate: true })
