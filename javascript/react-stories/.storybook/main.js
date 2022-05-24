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
  "core": {
    builder: 'webpack4'
  }
}