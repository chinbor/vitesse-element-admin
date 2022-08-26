# 图标
默认可以使用所有 https://icones.js.org/collection/all 里的图标

## 使用方式
前缀`i-`+图标名称，可以修改图标颜色(`text-red`)和大小(`text-lg`)
``` vue
<i i-fa6-solid:gear text-red text-lg />
```

## 自定义图标
将 https://www.iconfont.cn 里下载的svg图标或插画 放到 [~/assets/icons](https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/src/assets/icons) 目录下。使用方式前缀`i-custom:`+文件名:

- 示例
``` vue
 <i i-custom:404 />
```

- 预览地址 https://vitesse-element-admin.netlify.app/404