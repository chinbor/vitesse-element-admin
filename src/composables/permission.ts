export function hasPermission(val: string) {
  return useUserStore().userInfo.permissions?.includes(val)
}
