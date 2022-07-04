<route lang="yaml">
redirect: /system/role
meta:
  title: 角色权限
  order: 3
  permission:
    - title: 列表
      permission: /role
    - title: 添加
      permission: /role/post
    - title: 修改
      permission: /role/id/put
    - title: 删除
      permission: /role/id/delete
</route>
