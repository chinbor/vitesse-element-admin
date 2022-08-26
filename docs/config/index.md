# 基本字段
``` yaml
redirect: /blog
component: ~/layouts/index.vue
meta:
  title: 文章管理
  icon: i-iconoir:google-docs
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
## redirect
点击面包屑时的跳转路径
## hidden
是否在左侧导航栏显示
## title
定义当前路由的名称，如果不设置默认为`详情`
## icon
设置左侧导航栏的图标 可以使用任何 [iconify](https://github.com/iconify/iconify) 支持的图标。
## order
自定义生成的路由顺序，不设置的路由默认根据文件顺序生成。