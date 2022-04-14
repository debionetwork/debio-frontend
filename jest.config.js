module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  rootDir: ".",
  globals: {
    "vue-jest": {
      pug: {
        doctype: "html"
      }
    }
  },
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    "vue"
  ],
  moduleNameMapper: {
    "vuetify/lib(.*)": "<rootDir>/node_modules/vuetify/es5$1",
    "d3": "<rootDir>/tests/unit/import-all.mock.js",
    "topojson": "<rootDir>/tests/unit/import-all.mock.js",
    "@kiltprotocol/sdk-js": "<rootDir>/tests/unit/@kiltprotocol-sdk-js.mock.js",
    "@polkadot/ui-keyring": "<rootDir>/tests/unit/@polkadot-ui-keyring.mock.js",
    "@polkadot/util": "<rootDir>/tests/unit/@polkadot-util.mock.js",
    "@polkadot/keyring": "<rootDir>/tests/unit/@polkadot-keyring.mock.js",
    "@polkadot/api": "<rootDir>/tests/unit/@polkadot-api.mock.js",
    "@/lib/ipfs": "<rootDir>/tests/unit/ipfs-index.mock.js",
    "@/web-workers/ipfs-worker": "<rootDir>/tests/unit/ipfs-worker.mock.js",
    "@/web-workers/crypt-worker": "<rootDir>/tests/unit/crypt-worker.mock.js"
  },
  modulePaths: [
    "<rootDir>/src",
    "<rootDir>/node_modules"
  ],
  transform: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.ts?$": "ts-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(vuetify|@debionetwork)/)"
  ]
}
