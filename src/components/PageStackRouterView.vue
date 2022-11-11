<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script>
import { computed } from "vue";
import { usePageStackList } from "../useApi";

export default {
  name: "PageStackRouterView",
  setup() {
    const pageStackList = usePageStackList();
    const cachedViews = computed(() => pageStackList.map((v) => v.name));

    return {
      pageStackList,
      cachedViews,
    };
  },
};
</script>
