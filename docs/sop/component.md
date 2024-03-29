---
description: 默认支持流程图，tabs面板
---

# 内置第三方插件能力

## tabs
* Type: `boolean`

支持局部的`tabs`面板，**默认开启**

:::tip 一点说明
基于 [vitepress-plugin-tabs@0.2.0](https://www.npmjs.com/package/vitepress-plugin-tabs) 内置实现
:::

效果如下

:::=tabs
::tab1
一些内容

一些内容

一些内容

::tab2
一些内容 。。。
:::

简单的使用方式如下（效果如上面的示例）

```md
:::=tabs
::tab1
一些内容

一些内容

一些内容

::tab2
一些内容 。。。
:::
```

共享状态的使用方式如下

```md
:::=tabs=ab
::a
a content

::b
b content
:::

:::=tabs=ab
::a
a content 2

::b
b content 2
:::
```


:::=tabs=ab
::a
a content

::b
b content
:::

:::=tabs=ab
::a
a content 2

::b
b content 2
:::

不需要也可以关闭

```ts
// .vitepress/blog-theme.ts
const blogTheme = getThemeConfig({
  tabs: false
})
```

## Mermaid - 图表
* Type: `boolean`|`object`

>通过解析类 Markdown 的文本语法来实现图表的创建和动态修改。

:::tip 一点说明
基于 [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid) 实现
:::

简单语法如下，详细流程图语法见 [Mermaid 中文文档](https://github.com/mermaid-js/mermaid/blob/develop/README.zh-CN.md)

<pre>
```mermaid
flowchart TD
  Start --> Stop
```
</pre>


效果如下

```mermaid
flowchart TD
  Start --> Stop
```

**默认开启**，可以通过`mermaid`进行进一步配置，或关闭

:::code-group
```ts [① 关闭]
const blogTheme = getThemeConfig({
  mermaid: false
})
```
```ts [② 进一步配置]
const blogTheme = getThemeConfig({
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  }
})
```
:::

下面看一下官方其它案例

**时序图**
```mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
```

**甘特图**
```mermaid
gantt
    section Section
    Completed :done,    des1, 2014-01-06,2014-01-08
    Active        :active,  des2, 2014-01-07, 3d
    Parallel 1   :         des3, after des1, 1d
    Parallel 2   :         des4, after des1, 1d
    Parallel 3   :         des5, after des3, 1d
    Parallel 4   :         des6, after des4, 1d
```
