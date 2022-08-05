<route lang="yaml">
redirect: /knowledge
component: ~/layouts/index.vue
meta:
  icon: i-ant-design:read-outlined
  order: 3
  title: 知识管理
  permission:
    - title: 列表
      permission: /knowledge
    - title: 添加
      permission: /knowledge/post
    - title: 修改
      permission: /knowledge/[id]/put
    - title: 删除
      permission: /knowledge/[id]/delete
</route>
