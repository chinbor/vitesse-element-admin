<route lang="yaml">
redirect: /knowledge
component: ~/layouts/index.vue
meta:
  icon: ant-design:read-outlined
  title: 知识管理
  permission:
    - title: 列表
      permission: knowledge
    - title: 添加
      permission: knowledgePost
    - title: 修改
      permission: knowledgePut
    - title: 删除
      permission: knowledgeDelete
</route>
