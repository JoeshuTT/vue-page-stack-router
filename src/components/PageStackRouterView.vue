<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="pageStackRouter.pageList.map((v) => v.name)">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script>
import { usePageStackRouter } from "../useApi";

export default {
  name: "PageStackRouterView",
  setup() {
    const pageStackRouter = usePageStackRouter();

    return {
      pageStackRouter,
    };
  },
};
</script>
