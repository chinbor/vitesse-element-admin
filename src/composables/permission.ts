export function hasPermission(val: string) {
  return useUserStore().permissionList.includes(val)
}
