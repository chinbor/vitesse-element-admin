<p align='center'>
  <img src='https://user-images.githubusercontent.com/11247099/154486817-f86b8f20-5463-4122-b6e9-930622e757f2.png' alt='Vitesse - Opinionated Vite Starter Template' width='600'/>
</p>

<p align='center'>
vitesse-element-admin
</p>

<br>

`vitesse-element-admin` 是一套用于快速搭后台管理系统的模版. 它基于[vitesse](https://github.com/antfu/vitesse), [element-plus](https://github.com/element-plus/element-plus), [ag-grid](https://github.com/ag-grid/ag-grid) 和 [unocss](https://github.com/unocss/unocss) 构建, 并使用了基于文件系统的路由权限管理，无需路由配置文件，帮助你高效地开发后台系统。

- 预览 https://vitesse-element-admin.netlify.app
- 演示 https://stackblitz.com/github/zhiyuanzmj/vitesse-element-admin
- 文档 https://vitesse-element-admin.netlify.app/docs

## 初始化
推荐使用 [pnpm](https://github.com/pnpm/pnpm) 来进行包管理，如果没有安装pnpm, 请先运行: `npm install -g pnpm`

``` sh
npx degit zhiyuanzmj/vitesse-element-admin vitesse-element-admin
cd vitesse-element-admin
pnpm i
```

### 开发
``` sh
pnpm dev
```
浏览器访问: http://localhost:2222

### 发布
``` sh
pnpm build
```

## 后台接口
使用了 [nitro](https://github.com/unjs/nitro) 模拟后台接口，简单的实现了restful api接口，具体详情可查看[/server](https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/server)目录。

### 开发后台
``` sh
pnpm server:dev
```

### 发布后台
``` sh
pnpm server:build
```

## 其他
``` sh
# 预览发布环境效果
pnpm preview

# 代码格式检查
pnpm lint

# 代码格式检查并自动修复
pnpm lint --fix

# 检查Typescript
pnpm typecheck
```