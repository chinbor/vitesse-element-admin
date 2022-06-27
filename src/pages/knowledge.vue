<route lang="yaml">
redirect: /knowledge
component: ~/layouts/index.vue
meta:
  icon: ant-design:read-outlined
  title: 知识管理
  permission:
    - title: 列表
      permission: /sys/knowledgeBase/list
    - title: 添加
      permission: /sys/knowledgeBase/add
    - title: 修改
      permission: /sys/knowledgeBase/edit
    - title: 删除
      permission: /sys/knowledgeBase/delete
</route>
