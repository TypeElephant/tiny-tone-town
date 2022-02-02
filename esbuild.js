const fs = require("fs");
const esbuild = require("esbuild");
const cssModulesPlugin = require("esbuild-css-modules-plugin");
const svgrPlugin = require("esbuild-plugin-svgr");
const execSync = require("child_process").execSync;

const minify = process.argv[2] === "--minify=true";
const sourcemap = process.argv[3] === "--sourcemap=true";

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    outdir: "./build/static/js",
    bundle: true,
    minify,
    sourcemap,
    plugins: [
      svgrPlugin(),
      cssModulesPlugin({
        localsConvention: "dashes",
      }),
    ],
  })
  .catch((e) => console.error(e.message));
