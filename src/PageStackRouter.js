import { saveScrollPosition, revertScrollPosition } from "./scrollBehavior";
import { getRouteMetaValue } from "./utils/index";
import history from "./history/index";

export default class PageStackRouter {
  constructor(options = {}) {
    this.pageStackList = options.pageStackList;
    this.router = options.router;
    this.el = options.el;
    this.max = options.max;
    this.disableSaveScrollPosition = options.disableSaveScrollPosition;
  }

  navigate(to, from) {
    const toLocation = this.getRouteInfo(to);
    const fromLocation = this.getRouteInfo(from);

    const index = this.getIndexByName(toLocation.name);

    if (toLocation.meta.keepAlive) {
      if (~index) {
        this.pageStackList.splice(index + 1);
        !toLocation.meta.disableSaveScrollPosition &&
          revertScrollPosition(toLocation, this.router);
      } else {
        if (history.actionType === "replace") {
          this.pageStackList.splice(this.pageStackList.length - 1);
        }

        if (this.pageStackList.length >= this.max) {
          this.pageStackList.splice(0, 1);
        }

        this.pageStackList.push(toLocation);
        !fromLocation.meta.disableSaveScrollPosition &&
          saveScrollPosition(fromLocation, this.el);
      }
    }
  }

  getIndexByName(name) {
    return this.pageStackList.findIndex((v) => v.name === name);
  }

  getRouteInfo(location) {
    const historyState = window.history.state;

    return {
      name: location.name,
      path: location.path,
      fullPath: location.fullPath,
      meta: Object.assign({}, location.meta, {
        keepAlive: getRouteMetaValue("keepAlive", true, location.meta),
        disableSaveScrollPosition: getRouteMetaValue(
          "disableSaveScrollPosition",
          this.disableSaveScrollPosition,
          location.meta
        ),
      }),
      state: historyState,
      navigationType: "",
      navigationDirection: "",
    };
  }
}
