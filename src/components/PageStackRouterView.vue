<template>
  <keep-alive :include="$pageStackRouter.pageList.map((v) => v.name)">
    <router-view :key="$route.fullPath" />
  </keep-alive>
</template>

<script>
export default {
  name: "PageStackRouterView",
};
</script>
