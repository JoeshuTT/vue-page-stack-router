import { inject } from "vue";
import { pageStackRouterKey } from "./injectionSymbols";

/**
 * 返回 PageStackRouter 实例
 */
export function usePageStackRouter() {
  return inject(pageStackRouterKey);
}
