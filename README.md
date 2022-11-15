# vue-page-stack-router

> vue-page-stack-router 是一个 [Vue.js](https://vuejs.org/) 的页面栈路由管理器

## 功能特性

- 针对移动端 web 而设计
- 类似原生 APP 应用，小程序应用的导航体验，即前进刷新后退不刷新
- 保存滚动位置（默认为 `true`），在离开该页面时自动保存滚动位置，待返回后恢复保存的滚动位置

## 版本提示

你当前浏览的是 **vue-page-stack-router 2.x 版本** 的文档，适用于 Vue 2 开发。如果你在使用 Vue 3，请浏览 [vue-page-stack-router 文档](https://github.com/JoeshuTT/vue-page-stack-router)。

## 安装

```shell
# Vue 3 项目，安装
npm install vue-page-stack-router@3 --save
# Vue 2 项目，安装
npm install vue-page-stack-router@2 --save
```

## 使用

**main.js**

```js
import Vue from "Vue";
import router from "./router";
import VuePageStackRouter from "vue-page-stack-router";
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
import Vue from "vue";
import VueRouter from "vue-router";

const router = new VueRouter({
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

## API 和 使用注意

请查看[vue-page-stack-router 文档](https://github.com/JoeshuTT/vue-page-stack-router#api)
