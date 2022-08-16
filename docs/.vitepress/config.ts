import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  base: '/docs/',
  title: 'vitesse-element-admin',
  description: 'Vitesse 后台管理系统文档',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
  lastUpdated: true,
  outDir: '../dist/docs',
  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'Vitesse Element Admin',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '配置', link: '/config/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhiyuanzmj/vitesse-element-admin' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT zhiyuanzmj',
    },
    editLink: {
      pattern: 'https://github.com/zhiyuanzmj/vitesse-element-admin/tree/main/docs/:path',
      text: '为此页提供修改建议',
    },
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/' },
        ],
      },
      {
        text: '配置',
        items: [
          { text: '基本设置', link: '/config/' },
          { text: '权限设置', link: '/config/permission' },
          { text: '路由导航', link: '/config/router' },
          { text: '表格设置', link: '/config/ag-grid' },
        ],
      },
    ],
  },
})
