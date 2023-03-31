import { getThemeConfig, defineConfig } from '@sugarat/theme/node'
import { SearchPlugin } from 'vitepress-plugin-search'
import friend  from './config/friend'
import footer from './config/footer'
import nav from './config/nav'
import editLink from './config/editLink'
import home from './config/home'
import flexsearchoptions from './config/flexsearchoptions'

const blogTheme = getThemeConfig({
  // 文章默认作者
  author: 'windstarry',
  // 友链
  friend: friend,
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  search: false,
  // 用于设置首页的自定义内容,也可以在index中设置
  home: home,
  // 开启评论支持
  comment: {
    repo: 'Windstarry/windstarry',
    repoId: 'R_kgDOJQak9Q',
    category: 'Announcements',
    categoryId: 'DIC_kwDOJQak9c4CVbjE'
  },
  // 侧边栏增加推荐文章
  recommend: {
    title: '🔍 相关文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无推荐文章'
  }
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
    plugins:[SearchPlugin(flexsearchoptions)],
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
