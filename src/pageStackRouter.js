import { version } from "../package.json";
import { reactive } from "vue";
import PageStackRouterView from "./components/PageStackRouterView.vue";
import { navigationType, navigationDirection } from "./history/common";
import { saveScrollPosition, revertScrollPosition } from "./scrollBehavior";
import {
  pageStackRouterKey,
  pageStackRouteKey,
  pageStackListKey,
} from "./injectionSymbols";
import { getRouteMetaValue } from "./utils/index";

export function createPageStackRouter(options) {
  const currentPage = reactive({});
  const pageStackList = reactive([]);

  const {
    router,
    el = "#app",
    max = 10,
    disableSaveScrollPosition = false,
  } = options;
  if (!router) {
    throw new Error(`vue-router 实例必须存在！`);
  }

  function navigate(to, from) {
    const toLocation = getRouteInfo(to);
    const fromLocation = getRouteInfo(from);

    if (toLocation.meta.keepAlive) {
      const historyState = window.history.state;

      const lastPageState = pageStackList.length
        ? pageStackList[pageStackList.length - 1].state
        : null;
      let delta = lastPageState
        ? historyState.position - lastPageState.position
        : 0;

      // 在浏览器环境中，浏览器的后退等同于 pop ，前进等同于 push
      if (delta > 0) {
        toLocation.navigationType = navigationType.push;
        toLocation.navigationDirection = navigationDirection.forward;
        push(toLocation);
        !fromLocation.meta.disableSaveScrollPosition &&
          saveScrollPosition(fromLocation, el);
      } else if (delta < 0) {
        toLocation.navigationType = navigationType.pop;
        toLocation.navigationDirection = navigationDirection.back;
        pop();
        const index = getIndexByName(toLocation.name);
        if (~index) {
          !toLocation.meta.disableSaveScrollPosition &&
            revertScrollPosition(toLocation);
        }
      } else {
        toLocation.navigationType = navigationType.replace;
        toLocation.navigationDirection = navigationDirection.unknown;
        replace(toLocation);
      }
    }

    Object.keys(toLocation).forEach((key) => {
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
    const index = getIndexByName(location.name);
    if (~index) {
      pageStackList.splice(index + 1);
    } else {
      pageStackList.length && pageStackList.splice(pageStackList.length - 1);
      pageStackList.push(location);
    }
  }

  function getIndexByName(name) {
    return pageStackList.findIndex((v) => v.name === name);
  }

  function getRouteInfo(location) {
    const historyState = window.history.state;

    return {
      name: location.name,
      path: location.path,
      fullPath: location.fullPath,
      meta: Object.assign({}, location.meta, {
        keepAlive: getRouteMetaValue("keepAlive", true, location.meta),
        disableSaveScrollPosition: getRouteMetaValue(
          "disableSaveScrollPosition",
          disableSaveScrollPosition,
          location.meta
        ),
      }),
      state: historyState,
      navigationType: "",
      navigationDirection: "",
    };
  }

  const pageStackRouter = {
    version,
    pageStackList,
    currentPage,

    install(app) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const pageStackRouter = this;

      router.afterEach((to, from) => {
        if (to.name) {
          navigate(to, from);
        }
      });

      app.component("PageStackRouterView", PageStackRouterView);

      app.provide(pageStackRouterKey, pageStackRouter);
      app.provide(pageStackRouteKey, currentPage);
      app.provide(pageStackListKey, pageStackList);
    },
  };

  return pageStackRouter;
}
