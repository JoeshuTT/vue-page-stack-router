import { version } from "../package.json";
import { install } from "./install";
export * from "./useApi";
export { pageStackRouterKey } from "./injectionSymbols";

export const VuePageStackRouter = {
  install,
  version,
};
