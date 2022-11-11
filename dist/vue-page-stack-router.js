/*!
  * vue-page-stack-router v3.2.3
  * (c) 2022 JoeshuTT
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VuePageStackRouter = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

  /**
   *
   * @internal
   */
  var pageStackRouterKey = Symbol("page stack router");

  /**
   *
   * @internal
   */
  var pageStackRouteKey = Symbol("page stack route");

  /**
   *
   * @internal
   */
  var pageStackListKey = Symbol("page stack list");

  /**
   * 返回 PageStackRouter 实例
   */
  function usePageStackRouter() {
    return vue.inject(pageStackRouterKey);
  }

  /**
   * 返回 PageStackRouter 当前页面
   */
  function usePageStackRoute() {
    return vue.inject(pageStackRouteKey);
  }

  /**
   * 返回 PageStackRouter 页面栈列表
   */
  function usePageStackList() {
    return vue.inject(pageStackListKey);
  }

  var version = "3.2.3";

  var script = {
    name: "PageStackRouterView",
    setup() {
      const pageStackList = usePageStackList();
      const cachedViews = vue.computed(() => pageStackList.map((v) => v.name));

      return {
        pageStackList,
        cachedViews,
      };
    },
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_router_view = vue.resolveComponent("router-view");

    return (vue.openBlock(), vue.createBlock(_component_router_view, null, {
      default: vue.withCtx(({ Component, route }) => [
        (vue.openBlock(), vue.createBlock(vue.KeepAlive, { include: $setup.cachedViews }, [
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
   * 路由跳转，对应着栈的三种操作方式
   */
  var navigationType = {
    pop: "pop",
    push: "push",
    replace: "replace"
  };

  /**
   * 路由导航方向
   */
  var navigationDirection = {
    back: "back",
    forward: "forward",
    unknown: ""
  };

  /**
   * 是否是滚动元素
   * @param {Element} node
   */
  function isScrollableNode(node) {
    if (!node) {
      return false;
    }
    var overflowScrollReg = /scroll|auto/i;
    var {
      overflow
    } = window.getComputedStyle(node);
    return overflowScrollReg.test(overflow);
  }

  /**
   * 获取手动标记的滚动元素的集合
   * @param {string | string[]} el
   */
  function getManualScrollingNodes(el) {
    var elementList = Array.isArray(el) ? [...el] : [...[el]];
    return [...new Set(elementList)].map(v => document.querySelector(v));
  }

  var body = document.body;
  var screenScrollingElement = document.documentElement;
  var scrollPositions = new Map();

  /**
   * 保存该页面下各个滚动元素的滚动位置
   */
  function saveScrollPosition(from) {
    var appRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#app";
    // DOM 操作有风险，try catch 护体
    try {
      var _from$meta;
      var screenNodeList = [screenScrollingElement, body]; // 屏幕滚动容器元素
      var appRootNode = document.querySelector(appRoot); // Vue 应用实例挂载容器元素
      var pageNodeList = [];
      if ((_from$meta = from.meta) !== null && _from$meta !== void 0 && _from$meta.scrollingElement) {
        pageNodeList = [appRootNode, ...getManualScrollingNodes(from.meta.scrollingElement)];
      } else {
        pageNodeList = [appRootNode, ...appRootNode.querySelectorAll("*")];
      }
      // prettier-ignore
      var scrollableNodeList = [...screenNodeList, ...pageNodeList].filter(isScrollableNode);
      var saver = scrollableNodeList.map(node => [node, {
        left: node.scrollLeft,
        top: node.scrollTop
      }]);
      var scrollKey = from.fullPath;
      scrollPositions.set(scrollKey, saver);
    } catch (err) {
      console.error("[pageStack saveScrollPosition]", err);
    }
  }
  function getSavedScrollPosition(key) {
    var scroll = scrollPositions.get(key);
    scrollPositions.delete(key);
    return scroll;
  }

  /**
   * 恢复该页面下各个滚动元素的滚动位置
   */
  function revertScrollPosition(to) {
    var scrollKey = to.fullPath;
    var scrollPosition = getSavedScrollPosition(scrollKey);
    if (scrollPosition) {
      // DOM 操作有风险，try catch 护体
      try {
        vue.nextTick(() => {
          scrollPosition.forEach(_ref => {
            var [node, {
              left,
              top
            }] = _ref;
            left && (node.scrollLeft = left);
            top && (node.scrollTop = top);
          });
        });
      } catch (err) {
        console.error("[pageStack revertScrollPosition]", err);
      }
    }
  }

  /**
   * 是否有值
   * @param {*} val
   */
  function isDef(val) {
    return val !== undefined && val !== null;
  }

  /**
   * 根据 key 获取对应路由元信息字段值，值默认为 `true`
   */
  function getRouteMetaValue(key) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var value = meta[key];
    if (!isDef(value)) {
      value = defaultValue;
    }
    return value;
  }

  function createPageStackRouter(options) {
    var currentPage = vue.reactive({});
    var pageStackList = vue.reactive([]);
    var {
      router,
      el = "#app",
      max = 10,
      disableSaveScrollPosition = false
    } = options;
    if (!router) {
      throw new Error("vue-router \u5B9E\u4F8B\u5FC5\u987B\u5B58\u5728\uFF01");
    }
    function navigate(to, from) {
      var toLocation = getRouteInfo(to);
      if (toLocation.meta.keepAlive) {
        var historyState = window.history.state;
        var lastPageState = pageStackList.length ? pageStackList[pageStackList.length - 1].state : null;
        var delta = 0;
        delta = lastPageState ? historyState.position - lastPageState.position : 0;

        // 在浏览器环境中，浏览器的后退等同于 pop ，前进等同于 push
        if (delta > 0) {
          toLocation.navigationType = navigationType.push;
          push(toLocation);
          toLocation.meta.disableSaveScrollPosition && saveScrollPosition(from, el);
        }
        if (delta < 0) {
          toLocation.navigationType = navigationType.pop;
          pop();
          var index = getIndexByName(toLocation.name);
          if (~index) {
            toLocation.meta.disableSaveScrollPosition && revertScrollPosition(toLocation);
          }
        }
        toLocation.navigationType = navigationType.replace;
        replace(toLocation);
        toLocation.navigationDirection = delta ? delta > 0 ? navigationDirection.forward : navigationDirection.back : navigationDirection.unknown;
      }
      Object.keys(toLocation).forEach(key => {
        currentPage[key] = toLocation[key];
      });
    }

    /**
     * push 方法会在当前栈顶推入一个页面
     */
    function push(location) {
      if (pageStackList.length >= max) {
        pageStackList.splice(0, 1);
      }
      pageStackList.push(location);
    }

    /**
     * pop 方法会推出栈顶的一个页面
     */
    function pop() {
      pageStackList.splice(pageStackList.length - 1);
    }

    /**
     * replace 方法会替换当前栈顶的页面
     */
    function replace(location) {
      pageStackList.splice(pageStackList.length - 1);
      push(location);
    }
    function getIndexByName(name) {
      return pageStackList.findIndex(v => v.name === name);
    }
    function getRouteInfo(location) {
      var historyState = window.history.state;
      return {
        name: location.name,
        path: location.path,
        fullPath: location.fullPath,
        meta: Object.assign({}, location.meta, {
          keepAlive: getRouteMetaValue("keepAlive", true, location.meta),
          disableSaveScrollPosition: getRouteMetaValue("disableSaveScrollPosition", disableSaveScrollPosition, location.meta)
        }),
        state: historyState,
        navigationType: "",
        navigationDirection: ""
      };
    }
    var pageStackRouter = {
      version,
      pageStackList,
      currentPage,
      install(app) {
        var pageStackRouter = this;
        router.afterEach((to, from) => {
          if (to.name) {
            navigate(to, from);
          }
        });
        app.component("PageStackRouterView", script);
        app.provide(pageStackRouterKey, pageStackRouter);
        app.provide(pageStackRouteKey, currentPage);
        app.provide(pageStackListKey, pageStackList);
      }
    };
    return pageStackRouter;
  }

  exports.createPageStackRouter = createPageStackRouter;
  exports.pageStackListKey = pageStackListKey;
  exports.pageStackRouteKey = pageStackRouteKey;
  exports.pageStackRouterKey = pageStackRouterKey;
  exports.usePageStackList = usePageStackList;
  exports.usePageStackRoute = usePageStackRoute;
  exports.usePageStackRouter = usePageStackRouter;

}));
