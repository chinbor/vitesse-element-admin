<route lang="yaml">
redirect: /knowledge
component: ~/layouts/index.vue
meta:
  icon: i-iconoir:google-docs
  title: 知识管理
  order: 4
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
