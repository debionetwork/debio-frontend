module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    "@babel/preset-env"
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        // "absoluteRuntime": false,
        "corejs": false,
        // "helpers": true,
        "regenerator": true,
        // "useESModules": false
      }
    ]
  ]
}
