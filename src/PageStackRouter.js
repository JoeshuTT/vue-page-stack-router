import { saveScrollPosition, revertScrollPosition } from "./scrollBehavior";
import history from "./history/index";

export default class PageStackRouter {
  constructor(options = {}) {
    this.pageList = [];
    this.router = options.router;
    this.el = options.el;
    this.max = options.max;
    this.disableSaveScrollPosition = options.disableSaveScrollPosition;
  }

  getIndexByName(name) {
    return this.pageList.findIndex((v) => v.name === name);
  }

  navigate(to, from) {
    const index = this.getIndexByName(to.name);

    if (~index) {
      this.pageList.splice(index + 1);
      revertScrollPosition(to, this.router);
    } else {
      if (history.actionType === "replace") {
        this.pageList.splice(this.pageList.length - 1);
      }

      if (this.pageList.length >= this.max) {
        this.pageList.splice(0, 1);
      }

      this.pageList.push({
        name: to.name,
        scrollRestorationList: [],
      });

      saveScrollPosition(from, this.el);
    }
  }
}
