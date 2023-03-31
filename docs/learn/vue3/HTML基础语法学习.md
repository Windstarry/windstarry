---
title: HTML基础语法学习
date: 2023-3-31
description: HTML基础语法学习
recommend: 1
sticky: 1
tags:
- vue3
- HTML
categories:
- vue3
---
# HTML基础语法学习

## 基础语法

[学习网站](https://www.runoob.com)

### HTML常用标签

#### 标题标签

```html
<h1>这是一个标题</h1>
<h2>这是一个标题</h2>
<h3>这是一个标题</h3>
```

#### 段落标签

```html
<p>我是一个段落标签</p>
```

##### 换行标签

```html
<br />
```

##### 文本格式化标签

```html
<strong>加粗</strong>
<em>斜体</em>
<del>删除</del>
<ins>下划线</ins>
```

##### <div>和<span>标签

```html
<div>这是头部</div>    // 独占一行
<span>今日价格</span>   // 跨行显示
```

##### 图像标签

```html
<img src="图像URL" />

绝对路径or相对路径
相对路径
./    // 下一级路径
../   // 上一级路径

绝对路径
D:\Pycharm\GitPull\vue\code\VueText\img.jpg
```

##### 超链接

```html
<a href="跳转目标" target="目标窗口的弹出方式">文本图像</a>
target：_self 当前窗口打开;_blank  新窗口打开

<a href="http://www.badu.com"><img src="img.jpg" /></a>
```

##### 内部连接

```html
<a href="demo.html">内部html跳转</a>
```

##### 下载连接

```html
<a href="demo.zip">这是压缩包下载</a>
```

##### 锚点连接

```html
不跨页锚点
1.设置锚点
<a name="one">第一章</a>
2.设置启动定位器开关
 <a herf="#one">点我跳转第一章 </a>
跨页锚点
1.设置锚点
<a name="one">第一章</a>
2.设置启动定位器开关
<a herf="要跳转的页面名称.html#one">点我跳转第一章 </a>
```

##### 注释标签

```html
<!--  -->    // 快捷键 ctrl + /
```

##### 特殊字符

```html
&nbsp;   // 空格
```

##### 表格标签

```html
<table>
    <tr><td>姓名</td>  <td>性别</td>  <td>年龄</td></tr>
    <tr><td>刘德华</td>  <td>男</td>  <td>56</td></tr>
    <tr><td>张学友</td>  <td>男</td>  <td>54</td></tr>
     	.
        .
        .
</table>
```

##### 表头单元格标签(加粗居中显示)

```html
<table>
    <tr><th>姓名</th>  <th>性别</th>  <th>年龄</th></tr>
    <tr><td>刘德华</td>  <td>男</td>  <td>56</td></tr>
    <tr><td>张学友</td>  <td>男</td>  <td>54</td></tr>
     	.
        .
        .
</table>
```

##### 表格属性

```html
这些属性要写在表格标签<table>里面
```

|   属性名    |       属性值        |                        描述                        |
| :---------: | :-----------------: | :------------------------------------------------: |
|    align    | left、center、right |           规定表格相对周围元素的对齐方式           |
|   border    |        1或""        | 规定表格单元格受否拥有边框，默认为""，表示没有边框 |
| cellpadding |       像素值        |     规定单元格边沿与其内容之间的空白，默认1px      |
| cellspacing |       像素值        |           规定单元格之间的空白，默认2px            |
|    width    |   像素值或百分比    |                   规定表格的宽度                   |

##### 表格结构标签

```html
<thead></thead>  // 用于定义表格的头部。 必须拥有<tr>标签  一般位于第一行
<tbody></tbody>  // 用于定义表格的主题，主要放于数据本体

<table>
    <thead>
    <tr>
        <th>姓名</th>  
        <th>性别</th>  
        <th>年龄</th>
    </tr>
    </thead>    
    <tbody>
    <tr>
        <td>刘德华</td>  
        <td>男</td>  
        <td>56</td>
    </tr>
    <tr>
        <td>张学友</td>
        <td>男</td>
        <td>54</td>
     </tr>
    </tbody>
     	.
        .
        .
</table>
```

##### 合并单元格

```html
合并单元格方式：
- 跨行合并： rowspan="合并单元格个数"
- 跨列合并： colspan="合并单元格个数"
```

##### 列表标签

```html
无序列表   <ul>中只能嵌套<li>    <li>里面可以放任何标签
    <h4>您喜欢的食物？</h4>
    <ul>
        <li>榴莲</li>
        <li>臭豆腐</li>
        <li>鲱鱼罐头</li>
    </ul>
有序列表   <ol>中只能嵌套<li>     <li>里面可以放任何元素
    <h4>粉丝排行榜</h4>
    <ol>
        <li>刘德华 10000</li>
        <li>刘若英 1000</li>
        <li>冉勇 1</li>
    </ol>
自定义列表   <dl>中智能包含<dt>、<dd>   一个<dt>多个<dd>
    <dl>
        <dt>关注我们</dt>
        <dd>新浪微博</dd>
        <dd>微信</dd>
    </dl>
```

##### 表单标签

表单域：

```html
    <form action="url地址"method="提交方式" name="表单域名称">
        各种表单的元素控件
    </form>
```

| 属性名 |  属性值  |                       描述                       |
| :----: | :------: | :----------------------------------------------: |
| action | url地址  | 用于指定接收并处理表单数据的服务器程序的url地址  |
| method | get/post |  用于设置表单数据的提交方式，其取值为get或post   |
|  name  |   名称   | 用于指定表单的名称，以区分同一个页面中的多个表单 |

表单元素

```html
1、input输入表单元素
    <form action="xxx.php" method="GET">
        用户名: <input type="text" name="username" value="请输入用户名" maxlength="6">  <br>
        密 码:<input type="password" name="pwd"> <br>
        性别: 男 <input type="radio" name="sex"> 女<input type="radio" name="sex" checked> <br>
        爱好: 吃饭 <input type="checkbox" name="hobby"> 睡觉 <input type="checkbox" name="hobby"> 打豆豆 <input type="checkbox" name="hobby" checked> <br>
        <!-- 点击了提交按钮，可以把 表单域 form 里面的表单元素 里面的值 提交给后台服务 -->
        <input type="submit" value="免费注册">
        <!-- 重置按钮可以还原表单元素初始的默认值 -->
        <input type="reset" value="重新填写"> 
        <!-- 普通按钮 -->
        <input type="button" value="获取短信验证码">
        <!-- 上传 -->
        <input type="file" value="上传文件">
    </form>
```

| type属性值 | 描述                                                         |
| :--------- | :----------------------------------------------------------- |
| button     | 定义可点击按钮（多数情况下，用于通过 JavaScript 启动脚本）。 |
| checkbox   | 定义复选框。                                                 |
| file       | 定义输入字段和 "浏览"按钮，供文件上传。                      |
| hidden     | 定义隐藏的输入字段。                                         |
| image      | 定义图像形式的提交按钮。                                     |
| password   | 定义密码字段。该字段中的字符被掩码。                         |
| radio      | 定义单选按钮。                                               |
| reset      | 定义重置按钮。重置按钮会清除表单中的所有数据。               |
| submit     | 定义提交按钮。提交按钮会把表单数据发送到服务器。             |
| text       | 定义单行的输入字段，用户可在其中输入文本。默认宽度为 20 个字符。 |

|   属性    |    属性值    |                描述                 |
| :-------: | :----------: | :---------------------------------: |
|   name    | 由用户自定义 |         定义input元素的名称         |
|   value   | 由用户自定义 |          规定input元素的值          |
|  checked  |   checked    | 规定此input元素首次加载时应当被选中 |
| maxlength |    正整数    |   规定输入字段中的字符的最大长度    |

<label>标签  浏览器就会自动将焦点转到选择对应的表单元素上

```html
	<label for="male">男</label>
	<input type="radio" name="sex" id="male" />
	<br />
	<label for="female">女</label>
	<input type="radio" name="sex" id="female" />
```

```html
2、select下拉表单元素   selected="selected"时，当前项即为默认选中项
    <form>
        籍贯：
        <select>
            <option>山东</option>
            <option>北京</option>
            <option>重庆</option>
            <option selected="selected">火星</option> 
            .....
        </select>
    </form>
```

```html
3、textarea文本域元素
    <form>
        今日反馈:
        <textarea cols="50" rows="5">请输入想要反馈的内容</textarea>
    </form>
```

##### 一个简单的案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h4>青村不常在，抓紧谈恋爱</h4>
    <table width="600">
        <!-- 第一行 -->
        <tr>
            <td>性别:</td>
            <td>
                <label for="nan">男</label>
                <input type="radio" name="sex" id="nan" />
                <label for="nv">女</label>
                <input type="radio" name="sex" id="nv" />
            </td>
        </tr>
        <!-- 第二行 -->
        <tr>
            <td>生日:</td>
            <td>
                <select>
                    <option value="">--请选择年份--</option>
                    <option value="">2001</option>
                    <option value="">2002</option>
                    <option value="">2003</option>
                    <option value="">2004</option>
                </select>
                <select>
                    <option value="">--请选择月份--</option>
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                </select>
                <select>
                    <option value="">--请选择日--</option>
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                </select>
            </td>
        </tr>
        <!-- 第三行 -->
        <tr>
            <td>所在地区</td>
            <td><input type="text" value="北京"></td>
        </tr>
        <!-- 第四行 -->
        <tr>
            <td>婚姻状况:</td>
            <td>
                <label for="weihun">未婚</label>
                <input type="radio" name="marry" id="weihun" checked="checked">
                <label for="yihun">已婚</label>
                <input type="radio" name="marry" id="yihun">
                <label for="lihun">离婚</label>
                <input type="radio" name="marry" id="lihun">
            </td>
        </tr>
        <!-- 第五行 -->
        <tr>
            <td>学历:</td>
            <td><input type="text" value="本科"></td>

        </tr>
        <!-- 第六行 -->
        <tr>
            <td>喜欢类型:</td>
            <td>
                <input type="checkbox" name="love">妩媚的
                <input type="checkbox" name="love">可爱的
                <input type="checkbox" name="love">小鲜肉
                <input type="checkbox" name="love">老腊肉
                <input type="checkbox" name="love" checked>都喜欢
            </td>
        </tr>
        <!-- 第七行 -->
        <tr>
            <td>个人介绍:</td>
            <td>
                <textarea>个人简介</textarea>
            </td>
        </tr>
        <!-- 第八行 -->
        <tr>
            <td></td>
            <td>
                <input type="submit" value="免费注册">
            </td>
        </tr>
        <!-- 第九行 -->
        <tr>
            <td></td>
            <td>
                <input type="checkbox" checked>我同意注册条款和会员加入标准
            </td>
        </tr>
        <!-- 第十行 -->
        <tr>
            <td></td>
            <td>
                <a href="#">我是会员，立即登录</a>
            </td>
        </tr>
        <!-- 第十一行 -->
        <tr>
            <td></td>
            <td>
                <h4>我承诺</h4>
                <ul>
                    <li>年满18岁</li>
                    <li>抱着严肃的态度</li>
                    <li>真诚寻找另一半</li>
                </ul>
            </td>
        </tr>
    </table>
</body>
</html>
```

##### 如何查阅文档

[W3school](https://www.w3school.com.cn/)

[菜鸟教程](https://www.runoob.com/)