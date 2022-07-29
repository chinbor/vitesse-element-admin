# 基本字段
``` yaml
redirect: /knowledge
component: ~/layouts/index.vue
meta:
  title: 知识管理
  icon: ant-design:read-outlined
  order: 3
```

## Typescript 类型
``` ts
interface RouteMeta {
  hidden?: boolean
  title?: string
  icon?: string
  order?: number
}
```
## Redirect
点击面包屑时的跳转路径
## Hidden
是否在左侧导航栏显示
## Title
定义当前路由的名称，如果不设置默认为`详情`
## Icon
设置左侧导航栏的图标 可以使用任何 [iconify](https://github.com/iconify/iconify) 支持的图标。
## Order
自定义生成的路由顺序，不设置的路由默认根据文件顺序生成。