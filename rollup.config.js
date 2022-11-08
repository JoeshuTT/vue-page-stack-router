import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import vuePlugin from "rollup-plugin-vue";
import { readFileSync } from "node:fs";
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url))
);

const banner = `/*!
  * vue-page-stack-router v${pkg.version}
  * (c) ${new Date().getFullYear()} JoeshuTT
  * @license MIT
  */`;

export default {
  input: "./src/index.js",
  output: [
    {
      file: pkg.module,
      format: "esm",
      banner,
      globals: {
        vue: "Vue",
        "vue-router": "vue-router",
      },
      name: "VuePageStackRouter",
    },
    {
      file: pkg.main,
      format: "cjs",
      banner,
      globals: {
        vue: "Vue",
        "vue-router": "vue-router",
      },
      name: "VuePageStackRouter",
    },
    {
      file: pkg.browser,
      format: "umd",
      banner,
      globals: {
        vue: "Vue",
        "vue-router": "vue-router",
      },
      name: "VuePageStackRouter",
    },
  ],
  external: ["vue", "vue-router"],
  plugins: [
    // babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
    nodeResolve(),
    json(),
    vuePlugin(),
  ],
};
