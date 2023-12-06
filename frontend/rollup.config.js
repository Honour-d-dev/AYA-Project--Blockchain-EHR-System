import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [
    commonjs({
      dynamicRequireTargets: ["node_modules/@w3ui/*.js"],
      ignoreDynamicRequires: true,
      strictRequires: true,
    }),
  ],
};
