/*!
  * vue-page-stack-router v2.0.1
  * (c) 2022 JoeshuTT
  * @license MIT
  */
'use strict';

var version = "2.0.1";

//
//
//
//
//
//

var script = {
  name: "PageStackRouterView",
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "keep-alive",
    {
      attrs: {
        include: _vm.$pageStackRouter.pageList.map(function (v) {
          return v.name
        }),
      },
    },
    [_c("router-view", { key: _vm.$route.fullPath })],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

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
function revertScrollPosition(to, router) {
  const scrollKey = to.fullPath;
  const scrollPosition = getSavedScrollPosition(scrollKey);
  if (!router.app) {
    return
  }

  if (scrollPosition) {
    // DOM 操作有风险，try catch 护体
    try { 
      router.app.$nextTick(() => {
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

const history = {
  actionType: "",
};

class PageStackRouter {
  constructor(options = {}) {
    this.pageList = [];
    this.router = options.router;
    this.el = options.el;
    this.max = options.max;
    this.disableSaveScrollPosition = options.disableSaveScrollPosition;
  }

  getIndexByName(name) {
    return this.pageList.findIndex((v) => v.name === name);
  }

  navigate(to, from) {
    const index = this.getIndexByName(to.name);

    if (~index) {
      this.pageList.splice(index + 1);
      revertScrollPosition(to, this.router);
    } else {
      if (history.actionType === "replace") {
        this.pageList.splice(this.pageList.length - 1);
      }

      if (this.pageList.length >= this.max) {
        this.pageList.splice(0, 1);
      }

      this.pageList.push({
        name: to.name,
        scrollRestorationList: [],
      });

      saveScrollPosition(from, this.el);
    }
  }
}

function install(Vue, options = {}) {
  const {
    router,
    el = "#app",
    max = 10,
    manual = false,
    disableSaveScrollPosition = false,
  } = options;

  if (!router) {
    throw new Error(`vue-router 实例必须存在！`);
  }

  // 重写路由跳转方法，记录操作方式
  const originPush = router.push;
  const originReplace = router.replace;
  const originGo = router.go;
  const originBack = router.back;
  const originForward = router.forward;

  router.push = function push(location, onResolve, onReject) {
    history.actionType = "push";
    if (onResolve || onReject) {
      return originPush
        .call(this, location, onResolve, onReject)
        .catch((err) => err); // 修复路由报错 NavigationDuplicated
    }

    return originPush.call(this, location).catch((err) => err);
  };

  router.replace = function replace(location, onResolve, onReject) {
    history.actionType = "replace";
    if (onResolve || onReject) {
      return originReplace
        .call(this, location, onResolve, onReject)
        .catch((err) => err); // 修复路由报错 NavigationDuplicated
    }

    return originReplace.call(this, location).catch((err) => err);
  };

  router.go = function go(n) {
    history.actionType = "go";
    return originGo.call(this, n);
  };

  router.back = function back() {
    history.actionType = "back";
    return originBack.call(this);
  };

  router.forward = function forward() {
    history.actionType = "forward";
    return originForward.call(this);
  };

  const pageStackRouter = new PageStackRouter({
    router,
    el,
    max,
    disableSaveScrollPosition,
  });

  router.afterEach((to, from) => {
    let keepAlive = to.meta?.keepAlive;

    if (!manual) {
      keepAlive = true;
    }

    if (to.name && keepAlive) {
      pageStackRouter.navigate(to, from);
    }
  });

  Vue.component("PageStackRouterView", __vue_component__);

  Object.defineProperty(Vue.prototype, "$pageStackRouter", {
    get() {
      return pageStackRouter;
    },
  });
}

const VuePageStackRouter = {
  install,
  version,
};

module.exports = VuePageStackRouter;
