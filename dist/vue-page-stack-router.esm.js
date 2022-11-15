/*!
  * vue-page-stack-router v2.2.0
  * (c) 2022 JoeshuTT
  * @license MIT
  */
var version = "2.2.0";

//
//
//
//
//
//

var script = {
  name: "PageStackRouterView",
  computed: {
    cachedViews() {
      return this.$pageStackList.map((v) => v.name);
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
    { attrs: { include: _vm.cachedViews } },
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * 是否是滚动元素
 * @param {Element} node
 */
function isScrollableNode(node) {
  if (!node) {
    return false;
  }
  var overflowScrollReg = /scroll|auto/i;
  var _window$getComputedSt = window.getComputedStyle(node),
    overflow = _window$getComputedSt.overflow;
  return overflowScrollReg.test(overflow);
}

/**
 * 获取手动标记的滚动元素的集合
 * @param {string | string[]} el
 */
function getManualScrollingNodes(el) {
  var elementList = Array.isArray(el) ? _toConsumableArray(el) : [el].concat();
  return _toConsumableArray(new Set(elementList)).map(function (v) {
    return document.querySelector(v);
  });
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

    //   通过配置路由元信息，可以手动指定页面内滚动容器元素
    //   meta: {
    //    title: "餐厅",
    //    scrollingElement: [".list-scroller", ".header-bd-radio-group"],
    //    keepAlive: true
    //  }
    if ((_from$meta = from.meta) !== null && _from$meta !== void 0 && _from$meta.scrollingElement) {
      pageNodeList = [appRootNode].concat(_toConsumableArray(getManualScrollingNodes(from.meta.scrollingElement)));
    } else {
      pageNodeList = [appRootNode].concat(_toConsumableArray(appRootNode.querySelectorAll("*")));
    }
    // prettier-ignore
    var scrollableNodeList = [].concat(screenNodeList, _toConsumableArray(pageNodeList)).filter(isScrollableNode);
    var saver = scrollableNodeList.map(function (node) {
      return [node, {
        left: node.scrollLeft,
        top: node.scrollTop
      }];
    });
    var scrollKey = from.fullPath;
    scrollPositions.set(scrollKey, saver);
  } catch (err) {
    console.error("[pageStack saveScrollPosition]", err);
  }
}
function getSavedScrollPosition(key) {
  var scroll = scrollPositions.get(key);
  scrollPositions["delete"](key);
  return scroll;
}

/**
 * 恢复该页面下各个滚动元素的滚动位置
 */
function revertScrollPosition(to, router) {
  var scrollKey = to.fullPath;
  var scrollPosition = getSavedScrollPosition(scrollKey);
  if (!router.app) {
    return;
  }
  if (scrollPosition) {
    // DOM 操作有风险，try catch 护体
    try {
      router.app.$nextTick(function () {
        scrollPosition.forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            node = _ref2[0],
            _ref2$ = _ref2[1],
            left = _ref2$.left,
            top = _ref2$.top;
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

var history = {
  actionType: ""
};

var PageStackRouter = /*#__PURE__*/function () {
  function PageStackRouter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PageStackRouter);
    this.pageStackList = options.pageStackList;
    this.router = options.router;
    this.el = options.el;
    this.max = options.max;
    this.disableSaveScrollPosition = options.disableSaveScrollPosition;
  }
  _createClass(PageStackRouter, [{
    key: "navigate",
    value: function navigate(to, from) {
      var toLocation = this.getRouteInfo(to);
      var fromLocation = this.getRouteInfo(from);
      var index = this.getIndexByName(toLocation.name);
      if (toLocation.meta.keepAlive) {
        if (~index) {
          this.pageStackList.splice(index + 1);
          !toLocation.meta.disableSaveScrollPosition && revertScrollPosition(toLocation, this.router);
        } else {
          if (history.actionType === "replace") {
            this.pageStackList.splice(this.pageStackList.length - 1);
          }
          if (this.pageStackList.length >= this.max) {
            this.pageStackList.splice(0, 1);
          }
          this.pageStackList.push(toLocation);
          !fromLocation.meta.disableSaveScrollPosition && saveScrollPosition(fromLocation, this.el);
        }
      }
    }
  }, {
    key: "getIndexByName",
    value: function getIndexByName(name) {
      return this.pageStackList.findIndex(function (v) {
        return v.name === name;
      });
    }
  }, {
    key: "getRouteInfo",
    value: function getRouteInfo(location) {
      var historyState = window.history.state;
      return {
        name: location.name,
        path: location.path,
        fullPath: location.fullPath,
        meta: Object.assign({}, location.meta, {
          keepAlive: getRouteMetaValue("keepAlive", true, location.meta),
          disableSaveScrollPosition: getRouteMetaValue("disableSaveScrollPosition", this.disableSaveScrollPosition, location.meta)
        }),
        state: historyState,
        navigationType: "",
        navigationDirection: ""
      };
    }
  }]);
  return PageStackRouter;
}();

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var state = {
    pageStackList: []
  };
  var router = options.router,
    _options$el = options.el,
    el = _options$el === void 0 ? "#app" : _options$el,
    _options$max = options.max,
    max = _options$max === void 0 ? 10 : _options$max,
    _options$disableSaveS = options.disableSaveScrollPosition,
    disableSaveScrollPosition = _options$disableSaveS === void 0 ? false : _options$disableSaveS;
  if (!router) {
    throw new Error("vue-router \u5B9E\u4F8B\u5FC5\u987B\u5B58\u5728\uFF01");
  }

  // 重写路由跳转方法，记录操作方式
  var originPush = router.push;
  var originReplace = router.replace;
  var originGo = router.go;
  var originBack = router.back;
  var originForward = router.forward;
  router.push = function push(location, onResolve, onReject) {
    history.actionType = "push";
    if (onResolve || onReject) {
      return originPush.call(this, location, onResolve, onReject)["catch"](function (err) {
        return err;
      }); // 修复路由报错 NavigationDuplicated
    }

    return originPush.call(this, location)["catch"](function (err) {
      return err;
    });
  };
  router.replace = function replace(location, onResolve, onReject) {
    history.actionType = "replace";
    if (onResolve || onReject) {
      return originReplace.call(this, location, onResolve, onReject)["catch"](function (err) {
        return err;
      }); // 修复路由报错 NavigationDuplicated
    }

    return originReplace.call(this, location)["catch"](function (err) {
      return err;
    });
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
  var pageStackRouter = new PageStackRouter({
    pageStackList: state.pageStackList,
    router: router,
    el: el,
    max: max,
    disableSaveScrollPosition: disableSaveScrollPosition
  });
  router.afterEach(function (to, from) {
    if (to.name) {
      pageStackRouter.navigate(to, from);
    }
  });
  Vue.util.defineReactive(state, "pageStackList");
  Vue.component("PageStackRouterView", __vue_component__);
  Object.defineProperty(Vue.prototype, "$pageStackRouter", {
    get: function get() {
      return pageStackRouter;
    }
  });
  Object.defineProperty(Vue.prototype, "$pageStackList", {
    get: function get() {
      return state.pageStackList;
    }
  });
}

var VuePageStackRouter = {
  install: install,
  version: version
};

export { VuePageStackRouter as default };
