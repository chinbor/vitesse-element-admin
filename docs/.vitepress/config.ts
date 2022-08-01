import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  base: '/docs/',
  title: 'vitesse-element-admin',
  description: 'Vitesse 后台管理系统文档',
  lastUpdated: true,
  outDir: '../dist/docs',
  themeConfig: {
    siteTitle: 'Vitesse Element Admin',
    nav: [
      { text: '指南', link: '/guide/introduction' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/getting-started' },
        ],
      },
      {
        text: '配置',
        items: [
          { text: '基本设置', link: '/guide/base' },
          { text: '权限设置', link: '/guide/permission' },
          { text: '路由导航', link: '/guide/router' },
        ],
      },
    ],
  },
})
