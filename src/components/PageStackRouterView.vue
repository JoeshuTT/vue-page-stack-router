<template>
  <keep-alive :include="cachedViews">
    <router-view :key="$route.fullPath" />
  </keep-alive>
</template>

<script>
export default {
  name: "PageStackRouterView",
  computed: {
    cachedViews() {
      return this.$pageStackList.map((v) => v.name);
    },
  },
};
</script>
