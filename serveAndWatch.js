const browserSync = require("browser-sync")
const historyFallback = require("connect-history-api-fallback")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const env = process.argv[2] || "dev"
const port = process.argv[3] || 3000

browserSync.init({
  port,
  server: {
    baseDir: "./build",
    middleware: [historyFallback()],
  },
  notify: false,
  ghostMode: false,
})

browserSync.watch("src/**/*.(tsx|ts|scss|json)", async function (event) {
  if (event === "change") {
    try {
      await exec(`npm run build -- ${env} evolv`)
      browserSync.reload()
    } catch (e) {
      const {stdout} = e
      console.log(stdout)
    }
  }
})

