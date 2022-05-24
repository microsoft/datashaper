/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment */
const ResolveTypescriptPlugin = require('resolve-typescript-plugin')
const path = require('path')

module.exports = {
  "stories": [
    path.join(__dirname, "../stories/**/*.stories.mdx"),
    path.join(__dirname, "../stories/**/*.stories.@(js|jsx|ts|tsx)"),
    path.join(__dirname, "../src/**/*.stories.mdx"),
    path.join(__dirname, "../src/**/*.stories.@(js|jsx|ts|tsx)")
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    builder: 'webpack4'
  },
  webpackFinal(config) {
    // resolve files ending with .ts
    config.resolve.plugins.push(new ResolveTypescriptPlugin())
    return config
  }
}