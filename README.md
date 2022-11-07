# vue-page-stack-router

> vue-page-stack-router 是一个 [Vue.js](https://vuejs.org/) 的页面栈路由管理器

## 功能特性

- 针对移动端 web 而设计
- 类似原生 APP 应用，小程序应用的导航体验，即前进刷新后退不刷新
- 保存滚动位置（默认为 `true`），在离开该页面时自动保存滚动位置，待返回后恢复保存的滚动位置

## 实现简述
对 `keep-alive` 组件 和 `router-view`组件的二次封装，使得路由组件实例的存活与路由跳转挂钩。
## 安装

```shell
# Vue 3 项目，安装
npm install vue-page-stack-router --save
# Vue 2 项目，安装
npm install vue-page-stack-router@2 --save
```

## 使用

```js
// main.js
import Vue from "Vue";
import router from "./router";
import VuePageStackRouter from "vue-page-stack-router";
// Pass a routing instance
Vue.use(VuePageStackRouter, { router });
```

```vue
// App.vue
<template>
  <div id="app">
    <PageStackRouterView />
  </div>
</template>
```

## 使用注意

1. 路由的`name`和组件的`name`要一样，缓存才会生效。
2. 只支持一级路由，不支持嵌套路由。
