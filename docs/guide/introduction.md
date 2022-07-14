# 简介

## 什么是 vitesse-element-admin ?
`vitesse-element-admin` 是一套用于快速搭后台管理系统的模版. 它基于[Vitesse](https://github.com/antfu/vitesse), [element-plus](https://github.com/element-plus/element-plus), [ag-grid](https://github.com/ag-grid/ag-grid) 和 [unocss](https://github.com/unocss/unocss) 构建, 并提供了一套基于文件结构的权限管理，精确到每个操作按钮，帮助你高效地开发后台系统。

- 预览 https://vitesse-element-admin.netlify.app
- 演示 https://stackblitz.com/github/zhiyuanzmj/vitesse-element-admin

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

## 初始化

### 包管理器
推荐使用 [pnpm](https://github.com/pnpm/pnpm) 来进行包管理，如果没有安装pnpm, 请先运行:

``` sh
npm install -g pnpm
```

---

``` sh
npx degit zhiyuanzmj/vitesse-element-admin vitesse-element-admin
cd vitesse-element-admin
pnpm i
```

### 开发
``` sh
pnpm dev
```
浏览器访问: `http://localhost:3334`

### 发布
``` sh
pnpm build
```

### 其他
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