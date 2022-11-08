# vue-page-stack-router

> vue-page-stack-router 是一个 [Vue.js](https://vuejs.org/) 的页面栈路由管理器，支持 Vue 2 和 Vue 3

## 功能特性

- 针对移动端 web 而设计
- 类似原生 APP 应用，小程序应用的导航体验，即前进刷新后退不刷新
- 保存滚动位置（默认为 `true`），在离开该页面时自动保存滚动位置，待返回后恢复保存的滚动位置

## 版本提示

你当前浏览的是 **vue-page-stack-router 3.x 版本** 的文档，适用于 Vue 3 开发。如果你在使用 Vue 2，请浏览 [vue-page-stack-router@2 文档](https://github.com/JoeshuTT/vue-page-stack-router/tree/v2)。

## 🔥 例子

- [点击 v-shop 预览查看](https://github.com/JoeshuTT/v-shop)

## 安装

```shell
# Vue 3 项目，安装
npm install vue-page-stack-router --save
# Vue 2 项目，安装
npm install vue-page-stack-router@2 --save
```

## 使用

**main.js**

```js
import Vue from "Vue";
import router from "./router";
import { VuePageStackRouter } from "vue-page-stack-router";
// Pass a routing instance
Vue.use(VuePageStackRouter, { router });
```

**App.vue**

```vue
<template>
  <div id="app">
    <PageStackRouterView />
  </div>
</template>
```

**routes.js**

```js
import { createRouter, createWebHashHistory } from "vue-router";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home", // 与组件 name 保持一致
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "首页",
      },
    },
    {
      path: "/good/detail",
      name: "goodDetail", // 与组件 name 保持一致
      component: () => import("@/views/good/detail.vue"),
      meta: {
        title: "商品详情",
      },
    },
  ],
});
```

## API

`VuePageStackRouter` 插件参数说明：

| 参数                      | 说明                         | 类型      | 默认值 |
| ------------------------- | ---------------------------- | --------- | ------ |
| router                    | vue-router 实例              | `object`  | -      |
| el                        | Vue 应用实例挂载容器元素     | `string`  | '#app' |
| max                       | 最多可以缓存多少页面组件实例 | `number`  | 10     |
| disableSaveScrollPosition | 禁用自动保存滚动位置         | `boolean` | false  |

## 配置路由元信息（可选）

默认是不需要加的，但是为了灵活性，可以根据需要配置路由的 `meta` 字段：

```js
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
    // `scrollingElement`字段，手动指定页面内滚动容器元素。默认查询全部
    scrollingElement: [".list-scroller", ".header-bd-radio-group"],
    // `keepAlive`字段，是否参与页面栈导航。默认全部参与
    keepAlive: true
  },
},
```

## 使用注意

1. 路由的`name`和组件的`name`都需要设置成一样，缓存才会生效。
2. 只支持一级路由，不支持嵌套路由。
