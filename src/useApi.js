import { inject } from 'vue';
import { pageStackRouterKey, pageStackRouteKey, pageStackListKey } from './injectionSymbols';

/**
 * 返回 PageStackRouter 实例
 */
export function usePageStackRouter() {
  return inject(pageStackRouterKey);
}

/**
 * 返回 PageStackRouter 当前页面
 */
export function usePageStackRoute() {
  return inject(pageStackRouteKey);
}

/**
 * 返回 PageStackRouter 页面栈列表
 */
export function usePageStackList() {
  return inject(pageStackListKey);
}
