import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  base: '/docs/',
  title: 'vitesse-element-admin',
  description: 'Vitesse 后台管理系统文档',
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'vitesse-element-admin',
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
    ],
  },
})
