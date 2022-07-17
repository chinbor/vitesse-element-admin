<route lang="yaml">
redirect: /system/role
meta:
  title: 角色权限
  order: 3
  permission:
    - title: 列表
      permission: /roles
    - title: 添加
      permission: /roles/post
    - title: 修改
      permission: /roles/[id]/put
    - title: 删除
      permission: /roles/[id]/delete
</route>
