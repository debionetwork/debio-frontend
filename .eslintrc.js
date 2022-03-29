module.exports = {
    root: true,
    env: {
      node: true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    parserOptions: {
      parser: "babel-eslint"
    },
    ignorePatterns: ["src/common/lib/ipfs/*","tests/e2e/*"],
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true }
      ],
      "template-curly-spacing" : "off",
      "new-cap": 0,
      "semi": 0,
      "arrow-spacing": "error",
      "comma-dangle": ["error", "never"],
      "indent": ["error", 2, {
        "ignoredNodes": ["TemplateLiteral"]
      }],
      camelcase: [
        "error",
        { properties: "never", ignoreDestructuring: true }
      ],
      "eol-last": ["error", "always"]
    },
    overrides: [
      {
        files: [
          "**/__tests__/*.{j,t}s?(x)",
          "**/tests/unit/**/*.spec.{j,t}s?(x)"
        ],
        env: {
          jest: true
        }
      }
    ]
  }
  