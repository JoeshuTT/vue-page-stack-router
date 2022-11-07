/**
 * 是否是滚动元素
 * @param {Element} node
 */
export function isScrollableNode(node) {
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
export function getManualScrollingNodes(el) {
  const elementList = Array.isArray(el) ? [...el] : [...[el]];
  return [...new Set(elementList)].map((v) => document.querySelector(v));
}

/**
 * 获取该节点下所有滚动元素的集合
 * @param {Element} el
 */
export function getScrollableNodes(el) {
  return [...el.querySelectorAll("*"), el].filter(isScrollableNode);
}
