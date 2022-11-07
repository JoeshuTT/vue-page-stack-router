import PageStackRouterView from "./components/PageStackRouterView.vue";
import history from "./history";

export function install(Vue, options = {}) {
  const { router } = options;

  if (!router) {
    throw new Error(`vue-router 实例必须存在！`);
  }

  // 重写路由跳转方法，记录操作方式
  const originPush = router.push;
  const originReplace = router.replace;
  const originGo = router.go;
  const originBack = router.back;
  const originForward = router.forward;

  router.push = function push(location, onResolve, onReject) {
    history.actionType = "push";
    if (onResolve || onReject) {
      return originPush
        .call(this, location, onResolve, onReject)
        .catch((err) => err); // 修复路由报错 NavigationDuplicated
    }

    return originPush.call(this, location).catch((err) => err);
  };

  router.replace = function replace(location, onResolve, onReject) {
    history.actionType = "replace";
    if (onResolve || onReject) {
      return originReplace
        .call(this, location, onResolve, onReject)
        .catch((err) => err); // 修复路由报错 NavigationDuplicated
    }

    return originReplace.call(this, location).catch((err) => err);
  };

  router.go = function go(n) {
    history.actionType = "go";
    return originGo.call(this, n);
  };

  router.back = function back() {
    history.actionType = "back";
    return originBack.call(this);
  };

  router.forward = function forward() {
    history.actionType = "forward";
    return originForward.call(this);
  };

  // 保存滚动位置
  Vue.mixin({
    beforeRouteLeave(_to, from, next) {
      this.$parent &&
        this.$parent.saveScrollPosition &&
        this.$parent.saveScrollPosition(from);

      next();
    },
  });

  Vue.component("PageStackRouterView", PageStackRouterView);
}
