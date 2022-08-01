# 路由导航
## 侧边栏(Sidebar)
> 代码地址
[~/layouts/Sidebar](https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/src/layouts/Sidebar)

根据[useUserStorage().sidebarList](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/stores/user.ts#L12)生成，默认通过路由文件名排序 想调整顺序的可以设置`meta.order`。

``` yaml
meta:
  title: 用户管理
  order: 2
```
::: tip 
设置 `meta.hidden` 为`true` 则不在侧边栏显示, 例如登陆页和404页面 
:::

## 面包屑导航(Navigation)
根据当前页面的`$route.matched`属性生成, 可以通过设置`redirect`给没有`component`的页面定义跳转url。
> 代码地址
[~/layouts/Navigation](https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/src/layouts/Navigation)

## 标签栏导航(TagsView)
### [useTagsViewStore](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/stores/tagsView.ts)
维护了两个数组
- visitedViews: 用户访问过的路由集合
- cachedViews: 访问过的路由名称集合，不在数组内的不会被`keep-alive`
::: warning
为了使`keep-alive`正常，请确保路由名称和组件名称一致，本项目使用了[vite-plugin-vue-setup-extend](https://github.com/vbenjs/vite-plugin-vue-setup-extend)插件，设置如下:
``` vue
<script setup lang="ts" name="user">
// ...
</script>

<route lang="yaml">
name: user
</route>
```
:::
