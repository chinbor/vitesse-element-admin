<route lang="yaml">
redirect: /blog
component: ~/layouts/index.vue
meta:
  icon: i-iconoir:google-docs
  title: 文章管理
  order: 4
  permission:
    - title: 列表
      permission: /blogs
    - title: 添加
      permission: /blogs/post
    - title: 修改
      permission: /blogs/[id]/put
    - title: 删除
      permission: /blogs/[id]/delete
</route>
