import { getThemeConfig, defineConfig } from '@sugarat/theme/node'
import { SearchPlugin } from 'vitepress-plugin-search'
import friend  from './config/friend'
import footer from './config/footer'
import nav from './config/nav'
import editLink from './config/editLink'
import home from './config/home'

const blogTheme = getThemeConfig({
  // 文章默认作者
  author: 'windstarry',
  // 友链
  friend: friend,
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  search: false,
  // 用于设置首页的自定义内容,也可以在index中设置
  home: home
})

export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cmn-Hans',
  title: "windstarry's blog",
  description: '知识是一点一滴的积累...',
  base: '/windstarry/',
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    },
    plugins:[SearchPlugin()],
  },
  themeConfig: {
    lastUpdatedText: '上次更新于',
    footer:footer,
    logo: '/logo.png',
    editLink: editLink,
    nav:nav,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://windstarry.gitee.io/'
      }
    ]
  }
})
