# 快速开始

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
浏览器访问: [!http://localhost:2222](http://localhost:2222)

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