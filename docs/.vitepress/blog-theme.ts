// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'
import friend from './config/friend'
import footer from './config/footer'

// 开启RSS支持（RSS配置）
// import type { Theme } from '@sugarat/theme'

// const baseUrl = 'https://sugarat.top'
// const RSS: Theme.RSSOptions = {
//   title: '粥里有勺糖',
//   baseUrl,
//   copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
//   description: '你的指尖,拥有改变世界的力量（大前端相关技术分享）',
//   language: 'zh-cn',
//   image: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
//   favicon: 'https://sugarat.top/favicon.ico',
// }

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 开启RSS支持
  // RSS,

  // 搜索
  // 默认开启pagefind离线的全文搜索支持（如使用其它的可以设置为false）
  // 如果npx pagefind 时间过长，可以手动将其安装为项目依赖 pnpm add pagefind
  search: true,

  // 页脚
  footer: footer,

  // 主题色修改
  themeColor: 'el-blue',

  // 文章默认作者
  author: 'windstarry',

  // 友链
  friend: friend,
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
  },
  // //是否展示文章的预计阅读时间
  article: {
    readingTime: true
  },
})

export { blogTheme }
