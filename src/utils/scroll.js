/**
 * 判断该节点是否是已滚动的元素
 * @param {Element} node
 * @param {number} offset
 * @description
 * - 滚动距离小于 offset 时，可以忽视掉，避免多余的 dom 操作
 */
export function isScrollableNode(node, offset = 10) {
  if (!node) {
    return false;
  }

  return node.scrollWidth > node.clientWidth + offset || node.scrollHeight > node.clientHeight + offset;
}

/**
 * 在`manual`模式下，获取标记的可滚动元素的集合
 * @param {string | string[]} el
 */
export function getManualScrollingNodes(el) {
  const elementList = Array.isArray(el) ? [...el] : [...[el]];
  return [...new Set(elementList)].map(v => document.querySelector(v));
}

/**
 * 获取该节点下所有可滚动元素的集合
 * @param {Element} el
 */
export function getScrollableNodes(el) {
  return [...el.querySelectorAll("*"), el].filter(isScrollableNode);
}
