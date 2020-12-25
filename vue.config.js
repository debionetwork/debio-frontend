const WorkerPlugin = require('worker-plugin')

module.exports = {
  "transpileDependencies": [
    "vuetify",
    "eslint-loader",
  ],
  configureWebpack: {
    output: {
      globalObject: "this"
    },
    plugins: [
      new WorkerPlugin()
    ]
  }
}
