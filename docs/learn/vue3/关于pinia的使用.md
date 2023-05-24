---
title: 关于pinia的使用
date: 2023-5-24
description: 关于pinia的使用
recommend: 1
sticky: 3
tags:
 - vue3
 - 项目实战
categories:
 - vue3
---
# pinia的基础使用

## 1.安装pinia
```shell
yarn add pinia
```
## 2.创建pinia，在src/stroes目录下创建index.ts文件,添加下面的内容：

```javascript
import { createPinia } from 'pinia'
const pinia = createPinia()
export default pinia
```
## 3.在main.ts中注册pinia
```javascript
import { createApp } from 'vue'
import pinia from './store/index'
import App from './App.vue'

app.use(pinia)
app.mount('#app')
```

## 4.定义modules
在src/stores/modules下创建user.ts文件，定义user相关的store

```javascript
import { defineStore } from 'pinia'
import { getUserInfo, logout } from '@/api'
import type { UserState } from './model/userModel'
import type { UserInfo } from '@/api/user/types'
import { useAuthStore } from './auth'
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: '',
    userInfo: null,
  }),
  actions: {
    // setToken
    setToken(token: string) {
      this.token = token
    },
    // setUserInfo
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    // 重置用户信息
    resetUser() {
      this.token = ''
      this.userInfo = null
    },
  },
})
```
在pinia中通过defineStore定义一个store
id是store的唯一标识，不同的store不能重复
state为定义store的状态
actions定义方法，这里可以修改state

## 5.使用store
```js
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
// 通过userStore就能拿到state或者actions
const { name, avatar } = userStore.userInfo || {}
```
## 6.store持久化
何为store持久化？持久化的意思就是刷新页面store的数据也不会消失，实现的思路也很简单，就是把store中的数据缓存到localStorage中，然后store初始化的值从store中获取就行了。如果是挨个缓存，然后挨个取值，显得很不明智。这里我们找到了一个持久化的插件：pinia-plugin-persistedstate。具体的使用方法如下：

安装依赖：
```shell
yarn add pinia-plugin-persistedstate
```
修改src/store/index.ts

```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```
在需要做持久化的store中添加persist，比如src/store/modules/user.ts

```javascript

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    ...
  }),
  actions: {
    ...
  },
  // 为true，app-user这个store中的state数据将缓存到localStorage
  persist: true,
})
```
最终实现效果如下：当你刷新了页面以后，store中的数据会自动的进行初始化成缓存中的值了。

## 7.如何清空store
在退出登陆的时候，我们需要把某些store清空，并且把缓冲中的数据一起清空。以前我们总是通过单独第一个方法，然后把state挨个置空：

```javascript
// 重置用户信息
resetUser() {
    this.token = ''
    this.userInfo = null
},
```
如果我们都很store都需要清空，这么写也太麻烦了吧。如何变得更加高效呢？

在pinia中，提供了一个$reset()方法，可以清空某个stroe。假如我们现在有下面两个store清空，然后清楚某个缓存，就可以封装成一个一个单独的hooks：

```javascript
import { useUserStore } from '@/store/modules/user'
import { useAuthStore } from '@/store/modules/auth'
export function RESEETSTORE() {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  userStore.$reset()
  authStore.$reset()
  // 清除用户信息缓存
  localStorage.removeItem('app-user')
}
```
这样，我们在处理退出登陆逻辑的时候，只需要调用RESEETSTORE()就万事大吉。