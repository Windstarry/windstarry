import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

import { SearchPlugin } from 'vitepress-plugin-search'
import flexsearchoptions from './config/flexsearchoptions'
import editLink from './config/editLink'
import nav from './config/nav'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  lang: 'zh-cn',
  title: 'windstarry',
  description: 'windstarry的博客主题',
  lastUpdated: true,
  base: '/windstarry/',
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    },
    plugins:[SearchPlugin(flexsearchoptions)],
  },
  themeConfig: {
    lastUpdatedText: '上次更新于',
    logo: '/logo.png',
    editLink: editLink,
    nav: nav,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
      }
    ]
  }
})
