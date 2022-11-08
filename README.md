# vue-page-stack-router

> vue-page-stack-router 是一个 [Vue.js](https://vuejs.org/) 的页面栈路由管理器，支持 Vue 2 和 Vue 3

## 功能特性

- 针对移动端 web 而设计
- 类似原生 APP 应用，小程序应用的导航体验，即前进刷新后退不刷新
- 保存滚动位置（默认为 `true`），在离开该页面时自动保存滚动位置，待返回后恢复保存的滚动位置

## 🔥 例子

- [点击 v-shop 预览](https://github.com/JoeshuTT/v-shop)

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
      name: "home", // 与组件name保持一致
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "首页",
      },
    },
    {
      path: "/good/detail",
      name: "goodDetail",  // 与组件name保持一致
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

| 参数                      | 说明                     | 类型      | 默认值 |
| ------------------------- | ------------------------ | --------- | ------ |
| router                    | vue-router 实例          | `object`  | -      |
| el                        | Vue 应用实例挂载容器元素 | `string`  | '#app' |
| max                       | 最多可以缓存多少组件实例 | `number`  | 10     |
| disableSaveScrollPosition | 禁用自动保存滚动位置     | `boolean` | false  |

## 使用注意

1. 路由的`name`和组件的`name`都需要设置成一样，缓存才会生效。
2. 只支持一级路由，不支持嵌套路由。
