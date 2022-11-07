<template>
  <keep-alive :include="cachedViews" :max="max">
    <router-view :key="key" />
  </keep-alive>
</template>

<script>
import history from "../history";
import { isScrollableNode, getManualScrollingNodes } from "../utils/scroll";
const body = document.body;
const screenScrollingElement = document.documentElement;

export default {
  name: "PageStackRouterView",
  props: {
    /**
     * Vue 根节点元素的 DOM 字符串
     */
    el: {
      require: true,
      type: String,
      default: "#app",
    },
    /**
     * 最多可以缓存多少组件实例。
     */
    max: {
      type: [String, Number],
      default: 10,
    },
    /**
     * 禁用自动保存滚动位置
     */
    disableSaveScrollPosition: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pageStackList: [],
    };
  },
  computed: {
    cachedViews() {
      return this.pageStackList.map((v) => v.name);
    },
    key() {
      return this.$route.path;
    },
  },
  watch: {
    $route(to) {
      if (to.meta.keepAlive) {
        const index = this.getIndexByName(to.name);

        if (~index) {
          this.pageStackList.splice(index + 1);
          this.revertScrollPosition(to);
        } else {
          if (history.actionType === "replace") {
            this.pageStackList.splice(this.pageStackList.length - 1);
          }

          if (this.pageStackList.length >= this.max) {
            this.pageStackList.splice(0, 1);
          }

          this.pageStackList.push({
            name: to.name,
            scrollRestorationList: [],
          });
        }
      }
    },
  },
  created() {},
  methods: {
    getIndexByName(name) {
      return this.pageStackList.findIndex((v) => v.name === name);
    },
    /**
     * 保存该页面下各个滚动元素的滚动位置
     */
    saveScrollPosition(from) {
      if (this.disableSaveScrollPosition) {
        return;
      }

      const index = this.getIndexByName(from.name);
      if (~index) {
        // DOM 操作有风险，try catch 护体
        try {
          const screenNodeList = [screenScrollingElement, body]; // 屏幕滚动容器元素
          const pageNode = document.querySelector(this.el);
          let pageNodeList = [];
          // 配置路由元信息，手动指定滚动元素
          // meta: {
          //   title: "餐厅",
          //   scrollingElement: [".list-scroller", ".header-bd-radio-group"],
          //   keepAlive: true
          // }
          if (from.meta.scrollingElement) {
            pageNodeList = [
              pageNode,
              ...getManualScrollingNodes(from.meta.scrollingElement),
            ];
          } else {
            pageNodeList = [pageNode, ...pageNode.querySelectorAll("*")];
          }
          // prettier-ignore
          const scrollableNodeList = [ ...screenNodeList, ...pageNodeList, ].filter(isScrollableNode);

          const saver = scrollableNodeList.map((node) => [
            node,
            {
              left: node.scrollLeft,
              top: node.scrollTop,
            },
          ]);

          this.pageStackList[index].scrollRestorationList = saver;
        } catch (err) {
          console.error("[pageStack saveScrollPosition]", err);
        }
      }
    },
    /**
     * 恢复该页面下各个滚动元素的滚动位置
     */
    revertScrollPosition(to) {
      if (this.disableSaveScrollPosition) {
        return;
      }

      const index = this.getIndexByName(to.name);

      if (~index) {
        // DOM 操作有风险，try catch 护体
        try {
          this.$nextTick(() => {
            this.pageStackList[index].scrollRestorationList.forEach(
              ([node, { left, top }]) => {
                left && (node.scrollLeft = left);
                top && (node.scrollTop = top);
              }
            );
          });
        } catch (err) {
          console.error("[pageStack revertScrollPosition]", err);
        }
      }
    },
  },
};
</script>
