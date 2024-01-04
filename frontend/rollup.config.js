import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [
    nodeResolve(),
    commonjs({
      dynamicRequireTargets: ["node_modules/@w3ui/*.js"],
      ignoreDynamicRequires: true,
      strictRequires: true,
    }),
  ],
};
