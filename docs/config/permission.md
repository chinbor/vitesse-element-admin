# 权限设置
本模版使用了 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)，无需router配置文件，所以权限设置就放在了路由文件的`meta.permission`字段里面。如下:
``` yaml
meta:
  title: 角色权限
  permission:
    - title: 列表
      permission: /roles
    - title: 添加
      permission: /roles/post
    - title: 修改
      permission: /roles/[id]/put
    - title: 删除
      permission: /roles/[id]/delete
```

## Typescript 类型
``` ts
interface RouteMeta {
  permission?: string | boolean | RouteMeta[]
  title?: string
}
```
## permission
- `不设置`: 表示当前页面没有权限，登陆后即可访问。

- `true`: 表示当前页面权限被子路由控制，如果所有子页面都没有权限，则当前路由也没权限。

- `false`: 表示当前页面不用登陆也可以访问 例如登陆页面 `/login`。

- `string`: 当前页面的唯一权限标识，由后台提供。前端可根据此标识判断页面是否显示，后端可根据此标识给对应的API报`403`错误。
``` yaml
meta:
  title: 用户管理
  permission: /users
```

- `RouteMeta[]`: 数组的第一项代表当前页面的权限。剩下的是当前页面的按钮权限，可以通过方法 [user.hasPermission](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/stores/user.ts#L57) 或者指令 [v-permission](https://github.com/zhiyuanzmj/vitesse-element-admin/blob/main/src/directive/permission.ts) 判断按钮权限
``` yaml
meta:
  title: 角色权限
  permission:
    - title: 列表
      permission: /roles
    - title: 添加
      permission: /roles/post
    - title: 修改
      permission: /roles/[id]/put
    - title: 删除
      permission: /roles/[id]/delete
```

``` html
<!-- 没有权限 则不显示元素 -->
<el-button v-permission="'/roles/post'">添加用户</el-button>

<!-- 显示元素 但是不能点击 -->
<router-link v-permission.disabled="'/roles/[id]/permissions'">角色权限详情</router-link>

<el-switch :disabled="!user.hasPermission('/roles/[id]/put')" />
```