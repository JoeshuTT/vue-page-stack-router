/*!
  * vue-page-stack-router v3.1.1
  * (c) 2022 JoeshuTT
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VuePageStackRouter = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

  var version = "3.1.1";

  /**
   * 使用 Symbol 作为 pageStackRouter 的注入名
   */
  const pageStackRouterKey = Symbol();

  /**
   * 返回 PageStackRouter 实例
   */
  function usePageStackRouter() {
    return vue.inject(pageStackRouterKey);
  }

  var script = {
    name: "PageStackRouterView",
    setup() {
      const pageStackRouter = usePageStackRouter();

      return {
        pageStackRouter,
      };
    },
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_router_view = vue.resolveComponent("router-view");

    return (vue.openBlock(), vue.createBlock(_component_router_view, null, {
      default: vue.withCtx(({ Component, route }) => [
        (vue.openBlock(), vue.createBlock(vue.KeepAlive, {
          include: $setup.pageStackRouter.pageList.map((v) => v.name)
        }, [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
            key: route.fullPath
          }))
        ], 1032 /* PROPS, DYNAMIC_SLOTS */, ["include"]))
      ]),
      _: 1 /* STABLE */
    }))
  }

  script.render = render;
  script.__file = "src/components/PageStackRouterView.vue";

  /**
   * 是否是滚动元素
   * @param {Element} node
   */
  function isScrollableNode(node) {
    if (!node) {
      return false;
    }

    const overflowScrollReg = /scroll|auto/i;
    const { overflow } = window.getComputedStyle(node);
    
    return overflowScrollReg.test(overflow);
  }

  /**
   * 获取手动标记的滚动元素的集合
   * @param {string | string[]} el
   */
  function getManualScrollingNodes(el) {
    const elementList = Array.isArray(el) ? [...el] : [...[el]];
    return [...new Set(elementList)].map((v) => document.querySelector(v));
  }

  const body = document.body;
  const screenScrollingElement = document.documentElement;

  const scrollPositions = new Map();

  /**
   * 保存该页面下各个滚动元素的滚动位置
   */
  function saveScrollPosition(from, appRoot = "#app") {
    // DOM 操作有风险，try catch 护体
    try {
      const screenNodeList = [screenScrollingElement, body]; // 屏幕滚动容器元素
      const appRootNode = document.querySelector(appRoot); // Vue 应用实例挂载容器元素
      let pageNodeList = [];


      if (from.meta?.scrollingElement) {
        pageNodeList = [
          appRootNode,
          ...getManualScrollingNodes(from.meta.scrollingElement),
        ];
      } else {
        pageNodeList = [appRootNode, ...appRootNode.querySelectorAll("*")];
      }
      // prettier-ignore
      const scrollableNodeList = [ ...screenNodeList, ...pageNodeList, ].filter(isScrollableNode);

      const saver = scrollableNodeList.map((node) => [
        node,
        {
          left: node.scrollLeft,
          top: node.scrollTop,
        },
      ]);

      const scrollKey = from.fullPath;
      scrollPositions.set(scrollKey, saver);
    } catch (err) {
      console.error("[pageStack saveScrollPosition]", err);
    }
  }

  function getSavedScrollPosition(key) {
    const scroll = scrollPositions.get(key);

    scrollPositions.delete(key);
    return scroll;
  }

  /**
   * 恢复该页面下各个滚动元素的滚动位置
   */
  function revertScrollPosition(to) {
    const scrollKey = to.fullPath;
    const scrollPosition = getSavedScrollPosition(scrollKey);

    if (scrollPosition) {
      // DOM 操作有风险，try catch 护体
      try {
        vue.nextTick(() => {
          scrollPosition.forEach(([node, { left, top }]) => {
            left && (node.scrollLeft = left);
            top && (node.scrollTop = top);
          });
        });
      } catch (err) {
        console.error("[pageStack revertScrollPosition]", err);
      }
    }
  }

  // import { navigationType, navigationDirection } from "./history/common";

  class PageStackRouter {
    constructor(options = {}) {
      this.pageList = [];
      this.el = options.el;
      this.max = options.max;
      this.disableSaveScrollPosition = options.disableSaveScrollPosition;
    }

    navigate(to, from) {
      const historyState = window.history.state;
      const lastPageState = this.pageList.length
        ? this.pageList[this.pageList.length - 1].state
        : null;

      let delta = 0;

      delta = lastPageState ? historyState.position - lastPageState.position : 0;

      // 在浏览器环境中，浏览器的后退等同于 pop ，前进等同于 push
      if (delta > 0) {
        this.push(to);
        !this.disableSaveScrollPosition && saveScrollPosition(from, this.el);
      }

      if (delta < 0) {
        !this.disableSaveScrollPosition && revertScrollPosition(to);
        this.pop();
      }

      this.replace(to);

      // TODO 记录路由导航方向，路由跳转方式
      // to.navigationType =  navigationType.pop,
      // to.navigationType =  navigationType.pop,

      //   direction: delta
      //     ? delta > 0
      //       ? navigationDirection.forward
      //       : navigationDirection.back
      //     : navigationDirection.unknown
    }

    /**
     * push 方法会在当前栈顶推入一个页面
     */
    push(location) {
      const historyState = window.history.state;

      if (this.pageList.length >= this.max) {
        this.pageList.splice(0, 1);
      }

      this.pageList.push({
        name: location.name,
        state: historyState,
      });
    }

    /**
     * pop 方法会推出栈顶的一个页面
     */
    pop() {
      this.pageList.splice(this.pageList.length - 1);
    }

    /**
     * replace 方法会替换当前栈顶的页面
     */
    replace(location) {
      this.pageList.splice(this.pageList.length - 1);

      this.push(location);
    }
  }

  /**
   * 是否有值
   * @param {*} val
   */
  function isDef(val) {
    return val !== undefined && val !== null;
  }

  function install(app, options = {}) {
    const {
      router,
      el = "#app",
      max = 10,
      disableSaveScrollPosition = false,
    } = options;

    if (!router) {
      throw new Error(`vue-router 实例必须存在！`);
    }

    const pageStackRouter = new PageStackRouter({
      el,
      max,
      disableSaveScrollPosition,
    });

    router.afterEach((to, from) => {
      let keepAlive = to.meta?.keepAlive;

      if (!isDef(keepAlive)) {
        keepAlive = true;
      }

      if (to.name && keepAlive) {
        pageStackRouter.navigate(to, from);
      }
    });

    app.component("PageStackRouterView", script);

    app.provide(pageStackRouterKey, vue.reactive(pageStackRouter));
  }

  const VuePageStackRouter = {
    install,
    version,
  };

  exports.VuePageStackRouter = VuePageStackRouter;
  exports.pageStackRouterKey = pageStackRouterKey;
  exports.usePageStackRouter = usePageStackRouter;

}));
