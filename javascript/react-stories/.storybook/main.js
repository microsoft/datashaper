const path = require('path')
module.exports = {
  "stories": [
    path.join(__dirname, "../stories/**/*.stories.mdx"),
    path.join(__dirname, "../stories/**/*.stories.@(js|jsx|ts|tsx)")
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "webpackFinal": (config) => {
    // // console.log("CMR", config.module.rules[0])
    // config.module.rules[0].use = { loader: require.resolve('swc-loader'), options: { parseMap: true } }
    return config
  },
  "core": {
    builder: 'webpack4'
  }
}