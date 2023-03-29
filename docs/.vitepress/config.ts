import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  // 文章默认作者
  author: 'windstarry',
  // 友链
  // friend: [
  //   {
  //     nickname: '粥里有勺糖',
  //     des: '你的指尖用于改变世界的力量',
  //     avatar:
  //       'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
  //     url: 'https://sugarat.top'
  //   }
  // ],
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  //search: 'pagefind',
  // 用于设置首页的自定义内容,也可以在index中设置
  // home: {
  //   name: 'windstarry的Blog',
  //   motto: '记录学习,记录生活',
  //   inspiring: '知识是一点一滴积累起来的...',
  //   pageSize: 6
  // }
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
    }
  },
  themeConfig: {
    lastUpdatedText: '上次更新于',
    footer: {
      message: 'Theme by <a target="_blank" href="https://windstarry.gitee.io//"> @windstarry | Copyright © 2022-2023',
      copyright:
        'MIT Licensed | <a target="_blank" href="https://windstarry.gitee.io/"> @windstarry </a>'
    },
    logo: '/logo.png',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      {
        text: '关于我',
        link: '/about-me'
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://windstarry.gitee.io/'
      }
    ]
  }
})
