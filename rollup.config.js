import { babel } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import vuePlugin from "rollup-plugin-vue";
import { readFileSync } from "node:fs";
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url))
);

const banner =
  "/*!\n" +
  ` * vue-page-stack-router v${pkg.version}\n` +
  ` * (c) 2022-${new Date().getFullYear()} JoeshuTT\n` +
  " * Released under the MIT License.\n" +
  " */";

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
    babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
    json(),
    vuePlugin(),
  ],
};
