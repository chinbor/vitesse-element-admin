# 路由导航
## 侧边栏(Sidebar)
> 代码地址
[~/layouts/Sidebar](https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/src/layouts/Sidebar)

根据[useUserStorage().sidebarList](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/stores/user.ts#L12)生成，默认通过文件名排序 想调整顺序的可以设置`meta.order`。

``` yaml
meta:
  title: 用户管理
  order: 2
```
::: tip 
设置 `meta.hidden` 为`true` 则不在侧边栏显示, 例如登陆页和404页面 
:::

## 面包屑导航(Navigation)
根据当前路由对象的`matched`属性生成, 可以通过设置`redirect`给没有`component`的页面定义跳转url
> 代码地址
[~/layouts/Navigation](https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/src/layouts/Navigation)

::: warning 注意
为了保持`keep-alive`，本项目修改了当前路由对象的[matched](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/modules/router.ts#L33)。如果需要用到`matched`，可以使用`router.resolve(route).matched`代替。
:::

## 标签栏导航(TagsView)
> 代码地址 [~/stores/tagsView](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/stores/tagsView.ts) 维护了两个数组:
- `visitedViews`: 用户访问过的路由集合
- `cachedViews`: 访问过的路由名称集合，不在数组内的不会被`keep-alive`

::: warning 注意
为了使`keep-alive`正常，请确保路由名称和组件名称一致。\
本项目使用了[vite-plugin-vue-setup-extend](https://github.com/vbenjs/vite-plugin-vue-setup-extend)插件，设置如下:
``` vue
<script setup lang="ts" name="user">
// ...
</script>

<route lang="yaml">
name: user
</route>
```
:::

### tagsView.resolve
- 类型: `(route: RouteLocationRaw) => RouteLocation`

传递`route`对象来查找`visitedViews`里的路由，如果未找到则使用`router.resolve`解析`route.path`，如果`route.redirect`不为空则优先解析。
``` ts
tagsView.resolve($route)
```

### tagsView.push
- 类型: `(route: RouteLocationRaw) => void`

传递`route`对象并根据`tagsView.resolve(route)`的结果跳转，如果传递的`route.path` 等于当前路由的`path`，则会刷新当前页面。
``` ts
tagsView.push($route)
```

### tagsView.back
- 类型: `(route?: RouteLocationRaw) => void`

关闭当前页面并根据传递的`route`对象调用`tagsView.push(route)`跳转，如果未传递`route`对象 则调用`router.back()`回到上个路由。
``` ts
tagsView.back()
```