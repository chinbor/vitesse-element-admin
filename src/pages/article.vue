<route lang="yaml">
redirect: /article
component: ~/layouts/index.vue
meta:
  icon: i-iconoir:google-docs
  title: 文章管理
  order: 4
  permission:
    - title: 列表
      permission: /articles
    - title: 添加
      permission: /articles/post
    - title: 修改
      permission: /articles/[id]/put
    - title: 删除
      permission: /articles/[id]/delete
</route>
