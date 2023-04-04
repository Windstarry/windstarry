---
title: '关于FastAPI与Vue3的通信'
description: '关于FastAPI与Vue3的通信'
recommend: 2
sticky: 4
tags:
 - python
 - 项目实战
 - FastApi
categories:
 - python
 - FastApi
---
#  FastAPI与Vue3的通信

## 前言
在设计网络程序时，前后端的分离设计已经是一门成熟的技术,本着不断学习的理念，现计划学习一下前后端分离技术，前端采用三大框架之一的Vue3，后端则采用Python的FastAPI框架,通过完成前后端最基本的通信问题来详细说明如何设置前端和后端。
## 一、前端设计
新建一个文件夹，比如mydemo，然后切换到该目录，运行下面命令,借助官方的自动生成框架：
```shell
npm init vue@latest
```
这个命令会自动调用create-vue，这是vue的官方脚手架工具，为了区分前后端，在该项目下，建议新手将所要创建的工程名设置为**frontend**，以区分同一个目录下的后端文件夹**backend**（目前该文件夹还未创建）。
运行下面命令：
```hell
cd frontend
npm install
npm run dev
```
或者使用yarn的命令
```shell
yarn install
yarn dev
```
此时在浏览器中输入网址[http://127.0.0.1:5174](http://127.0.0.1:5174/)(注意：端口有可能是5173)，就可以看到前端项目的页面了。

## 二、后端设计
安装FastAPI是容易的，在命令窗口运行如下代码：
```shell
pip install fastapi
pip install uvicorn[standard]
```
以上代码完成了FastAPI的基本安装，接下来在mydemo文件夹下创建一个backend文件夹，用以存放后端文件：
```shell
cd mydemo
mkdir backend
```
在backend文件夹中创建一个main.py文件，其中代码如下：
```python
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def read_root():    
    return {"Hello": "World"}
```
保存后，在backend路径的命令窗口运行以下代码：
```shell
uvicorn main:app --reload  --port 8001
```
则启动了后端服务器 
## 三、前端获取后端的数据
为了让前后端通信，需要在两者之间建立桥梁，毕竟两个服务器运行的是不同的网址，因此，一个基本的思路是要让前端知道从哪个网址获取信息，同时也要让后端知道请求方来自何处。
这时需要用到两个包，即前端需要用到axios这个包，后端则要用到CORS这个中间件。
### 1、前端的设置
1. 安装axios，在frontend文件夹的命令窗口下运行以下命令：
```shell
npm install axios
```
或者
```shell
yarn add axios
```
1. 修改**frontend/src/main.js**文件
```js 
import {createAPP} from 'vue'
import App from './App.vue'
import '/assets/main.css'
// 导入axios，数据发送的地址是http://127.0.0.1:8001
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8001'
axios.defaults.withCredentials = true

createAPP(App).mount('#app')
```
1. 在**frontend/src/App.vue**中，添加获取数据的代码
```vue
<script>
  import axios from "axios";
  export default {
    data() {
      return {
        msg: "你好，世界！",
      };
    },
    methods: {  
      getMessage() {
        axios.get("/").then((res) => {
          this.msg = res.data;        
        });
      },    
  },
};
</script>

<template>  
    <button @click="getMessage">第一个按钮</button>
    <p>{{ msg }}</p>  
</template>
```
:::tip 代码注释
在上述代码中，给按钮绑定了一个click事件，当这个按钮被点击时，它会调用getMessage()函数，该函数中用axios去获得后端根目录下的数据，然后将要显示的文字更改为相应的返回值{hello:world}。
:::
至此，前端配置完成，此时点击页面按钮不会有任何反应，如果打开网页开发工具中的控制台，你会看到错误信息。
### 2、后端的设置
在FastAPI中，设置CORS是很简单的。
:::tip 注意事项
当前端的axios.defaults.withCredentials设置为true时，后面的响应地址就必须明确为字符串，而不能是一个列表。
:::
这里的意思是，当跨域访问需要带session时，只能响应确定的地址请求。添加中间件CORS的代码如下：
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,    
    allow_origins= "http://127.0.0.1:5174/",    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

@app.get("/")
def read_root():
    return {"Hello": "World"}
```
至此，后端代码修改完毕。
此时，当点击一下页面的按钮，其下方的文字将变成后端FastAPI发送的信息，完成了从服务器端获取数据的过程。
## 四、前端向后端发送数据
当我们在客户端填写或是更改某个数据之后，往往需要将数据发送给服务器端，此时就需要用到数据的发送功能。
### 1、客户端设置
先在**frontend/src/App.vue**中添加一个发送的方法，同时添加一个按钮，当用户点击该按钮时，调用axios发送数据给服务器端，修改代码如下：
```vue
<script>
  import axios from "axios";
  export default {
    data() {
      return {
        msg: "你好，世界！",
      };
    },
    
    methods: {  
      sendMessage () { 
        axios.post(
          "/update_item/",
          {name: "张无忌", age:24},
        ).then((res) => {
          console.log(res.data);
      });
    },
      getMessage() {
        axios.get("/").then((res) => {
        this.msg = res.data;        
      });
    },    
  },
};
</script>

<template>  
    <button @click="getMessage">第一个按钮</button>
    <button @click="sendMessage">发送信息给服务器</button>
    <p>{{ msg }}</p>  
</template>
```
:::tip 注意事项
axios发送数据时，其数据是以字典的形式发送，当然也可以看作是json格式。
:::
在这里，axios提交的路径是/update_item/，因此服务器端必须建立该路由。
### 2、服务器端设置
为了接受客户端提交过来的数据，要进行两步操作：一是设立相应的路由地址，二是设置接受数据的模型，此时用到pydantic，该包会在安装fastAPI时同步安装，该包的主要功能是对接口数据进行定义、检查与管理。
在下面示例中，我们定义一个Item类来接受客户端提交的数据，**backend/main.py**的代码修改如下：
```python

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Union

class Item(BaseModel):
    name: str
    age: float
    is_TrueMan: Union[bool, None]=None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,    
    allow_origins= "http://127.0.0.1:5174/",    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/update_item/")
def update_item(item: Item):
    item.age += 10
    print(item)
    return {'item':item}
```
这里将接受到的人员年龄增加10后，打印在服务器端的控制台上，并将修改的结果返回给客户端，由客户端打印在浏览器的控制台上。服务器接受并修改了客户端传送过来的数据，客户端也接受到了修改后的数据。
至此，完成了一个客户端与服务器端完整的通信程序。