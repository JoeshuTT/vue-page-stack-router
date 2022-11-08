import { reactive } from "vue";
import PageStackRouterView from "./components/PageStackRouterView.vue";
import PageStackRouter from "./PageStackRouter";
import { pageStackRouterKey } from "./injectionSymbols";

export function install(app, options = {}) {
  const {
    router,
    el = "#app",
    max = 10,
    disableSaveScrollPosition = false,
  } = options;

  if (!router) {
    throw new Error(`vue-router 实例必须存在！`);
  }

  const pageStackRouter = new PageStackRouter({
    el,
    max,
    disableSaveScrollPosition,
  });

  router.afterEach(async (to, from) => {
    if (to.name) {
      pageStackRouter.navigate(to, from);
    }

    return true;
  });

  app.component("PageStackRouterView", PageStackRouterView);

  app.provide(pageStackRouterKey, reactive(pageStackRouter));
}
