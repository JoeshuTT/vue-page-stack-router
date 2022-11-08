/*!
  * vue-page-stack-router v3.0.0
  * (c) 2022 JoeshuTT
  * @license MIT
  */
import { inject, resolveComponent, openBlock, createBlock, withCtx, KeepAlive, resolveDynamicComponent, nextTick, reactive } from 'vue';

var version = "3.0.0";

/**
 * 使用 Symbol 作为 pageStackRouter 的注入名
 */
const pageStackRouterKey = Symbol();

/**
 * 返回 PageStackRouter 实例
 */
function usePageStackRouter() {
  return inject(pageStackRouterKey);
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
  const _component_router_view = resolveComponent("router-view");

  return (openBlock(), createBlock(_component_router_view, null, {
    default: withCtx(({ Component, route }) => [
      (openBlock(), createBlock(KeepAlive, {
        include: $setup.pageStackRouter.pageList.map((v) => v.name)
      }, [
        (openBlock(), createBlock(resolveDynamicComponent(Component), {
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

    //   通过配置路由元信息，可以手动指定页面内滚动容器元素
    //   meta: {
    //    title: "餐厅",
    //    scrollingElement: [".list-scroller", ".header-bd-radio-group"],
    //    keepAlive: true
    //  }
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
      nextTick(() => {
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

  pop() {
    this.pageList.splice(this.pageList.length - 1);
  }

  replace(location) {
    this.pageList.splice(this.pageList.length - 1);

    this.push(location);
  }
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

  router.afterEach(async (to, from) => {
    if (to.name) {
      pageStackRouter.navigate(to, from);
    }

    return true;
  });

  app.component("PageStackRouterView", script);

  app.provide(pageStackRouterKey, reactive(pageStackRouter));
}

const VuePageStackRouter = {
  install,
  version,
};

export { VuePageStackRouter, pageStackRouterKey, usePageStackRouter };
