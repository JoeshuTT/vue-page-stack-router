/*!
  * vue-page-stack-router v1.0.3
  * (c) 2022 JoeshuTT
  * @license MIT
  */
const history = {
  actionType: ''
};

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

//
const body = document.body;
const screenScrollingElement = document.documentElement;

var script = {
  name: "PageStackRouterView",
  props: {
    /**
     * Vue 根节点元素的 DOM 字符串
     */
    el: {
      require: true,
      type: String,
      default: "#app",
    },
    /**
     * 最多可以缓存多少组件实例。
     */
    max: {
      type: [String, Number],
      default: 10,
    },
    /**
     * 禁用自动保存滚动位置
     */
    disableSaveScrollPosition: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pageStackList: [],
    };
  },
  computed: {
    cachedViews() {
      return this.pageStackList.map((v) => v.name);
    },
    key() {
      return this.$route.path;
    },
  },
  watch: {
    $route(to) {
      if (to.meta.keepAlive) {
        const index = this.getIndexByName(to.name);

        if (~index) {
          this.pageStackList.splice(index + 1);
          this.revertScrollPosition(to);
        } else {
          if (history.actionType === "replace") {
            this.pageStackList.splice(this.pageStackList.length - 1);
          }

          if (this.pageStackList.length >= this.max) {
            this.pageStackList.splice(0, 1);
          }

          this.pageStackList.push({
            name: to.name,
            scrollRestorationList: [],
          });
        }
      }
    },
  },
  created() {},
  methods: {
    getIndexByName(name) {
      return this.pageStackList.findIndex((v) => v.name === name);
    },
    /**
     * 保存该页面下各个滚动元素的滚动位置
     */
    saveScrollPosition(from) {
      if (this.disableSaveScrollPosition) {
        return;
      }

      const index = this.getIndexByName(from.name);
      if (~index) {
        // DOM 操作有风险，try catch 护体
        try {
          const screenNodeList = [screenScrollingElement, body]; // 屏幕滚动容器元素
          const pageNode = document.querySelector(this.el);
          let pageNodeList = [];
          // 配置路由元信息，手动指定滚动元素
          // meta: {
          //   title: "餐厅",
          //   scrollingElement: [".list-scroller", ".header-bd-radio-group"],
          //   keepAlive: true
          // }
          if (from.meta.scrollingElement) {
            pageNodeList = [
              pageNode,
              ...getManualScrollingNodes(from.meta.scrollingElement),
            ];
          } else {
            pageNodeList = [pageNode, ...pageNode.querySelectorAll("*")];
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

          this.pageStackList[index].scrollRestorationList = saver;
        } catch (err) {
          console.error("[pageStack saveScrollPosition]", err);
        }
      }
    },
    /**
     * 恢复该页面下各个滚动元素的滚动位置
     */
    revertScrollPosition(to) {
      if (this.disableSaveScrollPosition) {
        return;
      }

      const index = this.getIndexByName(to.name);

      if (~index) {
        // DOM 操作有风险，try catch 护体
        try {
          this.$nextTick(() => {
            this.pageStackList[index].scrollRestorationList.forEach(
              ([node, { left, top }]) => {
                left && (node.scrollLeft = left);
                top && (node.scrollTop = top);
              }
            );
          });
        } catch (err) {
          console.error("[pageStack revertScrollPosition]", err);
        }
      }
    },
  },
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
    { attrs: { include: _vm.cachedViews, max: _vm.max } },
    [_c("router-view", { key: _vm.key })],
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

function install(Vue, options = {}) {
  const { router } = options;

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

  // 保存滚动位置
  Vue.mixin({
    beforeRouteLeave(_to, from, next) {
      this.$parent &&
        this.$parent.saveScrollPosition &&
        this.$parent.saveScrollPosition(from);

      next();
    },
  });

  Vue.component("PageStackRouterView", __vue_component__);
}

const pageStack = {};

pageStack.install = install;

export { pageStack as default };
