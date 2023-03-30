---
title: VitePress+GithubPages搭建自己的个人博客
date: 2023-03-28
description: VitePress+GithubPages搭建自己的个人博客
sticky: 1
tags:
 - 个人博客
 - VitePress
 - Github
categories:
 - 网站部署
---
# VitePress+Github Pages搭建自己的个人博客

## 前言

写下来的东西远比记住的东西永久，很多时候我们记录自己的知识但是我们又不想搞的很麻烦，我在看来目前 VitePress + Github Pages 的组合是一个不错的选择。

## VitePress

[VitePress](https://vuepress.vuejs.org/zh/) 是 VuePress 的弟弟，建立在 Vite 之上。它不仅有更快的速度，对 vue3 支持更好，并且它的配置项足够精简并且可用，使得开发者可以进行快速上手。

::: tip
PS：VitePress 与当前的 VuePress 生态系统 (主要是主题和插件) 不兼容。总体思路是，VitePress 将拥有一个更精简的主题 API (更偏向 JavaScript API 而不是文件布局约定)，并且可能没有插件 (可以在主题中完成所有定制)。
:::

::: warning
VitePress 目前处于 alpha 状态。它已经适合开箱即用地组织文档，但是具体配置以及和主题相关的 API 仍然可能在小的版本之间发生变化。
:::

## 快速上手

创建并进入新项目的目录。

```
$ mkdir vitepress-starter && cd vitepress-starter
```

用你喜欢的包管理工具初始化项目。

```
$ yarn init
```

添加 VitePress 和 Vue 作为项目的开发依赖项。

```
yarn add --dev vitepress vue
```

如何你在使用 pnpm 并且得到了 peer dependencies 警告，这是因为 @docsearch/js 的 peer dependencies 存在某些问题。你可以先不用处理或者在官网看见解决办法。

创建你的第一篇文档。

```
$ mkdir docs && echo '# Hello VitePress' > docs/index.md
```

在 ***package.json*** 里添加一些脚本。

```JSON
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  },
  ...
}
```

在本地启动文档服务。

```
$ yarn docs:dev
```

## 更多语法以及操作

经过简单的 DEMO 上手，相信你对 VitePress 有一定的了解了，但是有更多的语法以及有趣的东西这里无法一一展示，包括不限于：

* 特殊的 Markdown
* 资源处理
* Frontmatter
* 在 Markdown 中使用 Vue
* 团队页面
* 徽章
* 搜索
* 布局

你可以通过 [VitePress 官网](https://vuepress.vuejs.org/zh/) 去了解更多，如果你需要中文版的可以临时看一下[VitePress中文](https://vuepress.vuejs.org/zh/)。

## 有趣的插件

- vitepress-plugin-mermaid：在 Markdown 中制作流图
- vitepress-plugin-search：离线搜索插件（在你部署网站不能对外公布的时候将会很有用）

## Github Pages

GitHub Pages 是一项静态站点托管服务，它直接从 GitHub 上的仓库获取 index.html、HTML、CSS 和 JavaScript 文件，也可以通过构建过程运行文件，然后发布网站。

使用 GitHub Pages 有这些好处：

1. 使用零成本:  github pages 集成在 github 中, 直接和代码管理绑定在一起, 随着代码更新自动重新部署, 使用非常方便.
2. 免费:  免费提供[http://username.github.io](http://username.github.io)的域名, 免费的静态网站服务器.
3. 无数量限制:  github pages 没有使用的数量限制, 每一个 github repository 都可以部署为一个静态网站.

## 部署流程

1. 首先在 [Github](https://www.github.com)上创建一个仓库，并且将你的 VitePress 项目上传到这个仓库中
2. 在你的主题配置文件 ***docs/.vitepress/config.js*** 中，将 base 属性设置为你的 GitHub 仓库的名称。 如果你打算将你的站点部署到[https://foo.github.io/bar/](https://foo.github.io/bar/)，那么你应该将base设置为'/bar/'。 它应该始终以斜线开头和结尾。
3. 在项目的 ***.github/workflows*** 目录中创建一个名为 ***deploy.yml*** 的文件，内容如下：

   ```yaml
   name: Deploy

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
           with:
             fetch-depth: 0
         - uses: actions/setup-node@v3
           with:
             node-version: 16
             cache: yarn
         - run: yarn install --frozen-lockfile

         - name: Build
           run: yarn docs:build

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: docs/.vitepress/dist
             # cname: example.com # if wanna deploy to custom domain
   ```
4. 如果你使用的是 pnpm，那么需要使用下面的配置：

   ```yaml
   name: Deployon:
   push:
       branches:
       - mainjobs:
   deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
           with:
           fetch-depth: 0
       - uses: pnpm/action-setup@v2
           with:
           version: 6.32.9
       - uses: actions/setup-node@v3
           with:
           node-version: 16
           cache: pnpm
       - run: pnpm install --frozen-lockfile      - name: Build
           run: pnpm docs:build    - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: docs/.vitepress/dist
           # cname: example.com # if wanna deploy to custom domain
   ```

::: tip
PS：请替换对应的分支名称。例如，如果你要构建的分支是 master，则应将上述文件中的 main 替换为 master。
:::
5. 现在提交你的代码并将其推送到 main 分支,等待 action 完成。
6. 在 git 仓库的 Setting 选项里，选择 gh-pages 分支作为 GitHub Pages 的来源。现在，你的文档将在每次推送时自动部署（你的预览地址也会在这个页面展示）。
::: tip
PS：如何你不喜欢当前的域名，可以使用自己的域名，具体网上可以查一下资料。
:::
