// import { navigationType, navigationDirection } from "./history/common";
import { saveScrollPosition, revertScrollPosition } from "./scrollBehavior";

export default class PageStackRouter {
  constructor(options = {}) {
    this.pageList = [];
    this.el = options.el;
    this.max = options.max;
    this.disableSaveScrollPosition = options.disableSaveScrollPosition;
  }

  navigate(to, from) {
    const historyState = window.history.state;
    const lastPageState = this.pageList.length
      ? this.pageList[this.pageList.length - 1].state
      : null;

    let delta = 0;

    delta = lastPageState ? historyState.position - lastPageState.position : 0;

    // 在浏览器环境中，浏览器的后退等同于 pop ，前进等同于 push
    if (delta > 0) {
      this.push(to);
      !this.disableSaveScrollPosition && saveScrollPosition(from, this.el);
    }

    if (delta < 0) {
      !this.disableSaveScrollPosition && revertScrollPosition(to);
      this.pop();
    }

    this.replace(to);

    // TODO 记录路由导航方向，路由跳转方式
    // to.navigationType =  navigationType.pop,
    // to.navigationType =  navigationType.pop,

    //   direction: delta
    //     ? delta > 0
    //       ? navigationDirection.forward
    //       : navigationDirection.back
    //     : navigationDirection.unknown
  }

  push(location) {
    const historyState = window.history.state;

    if (this.pageList.length >= this.max) {
      this.pageList.splice(0, 1);
    }

    this.pageList.push({
      name: location.name,
      state: historyState,
    });
  }

  pop() {
    this.pageList.splice(this.pageList.length - 1);
  }

  replace(location) {
    this.pageList.splice(this.pageList.length - 1);

    this.push(location);
  }
}
