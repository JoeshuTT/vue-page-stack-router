const body = document.body;
const screenScrollingElement = document.documentElement;
import { isScrollableNode, getManualScrollingNodes } from "./utils/scroll";

export const scrollPositions = new Map();

/**
 * 保存该页面下各个滚动元素的滚动位置
 */
export function saveScrollPosition(from, appRoot = "#app") {
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

export function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);

  scrollPositions.delete(key);
  return scroll;
}

/**
 * 恢复该页面下各个滚动元素的滚动位置
 */
export function revertScrollPosition(to, router) {
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
