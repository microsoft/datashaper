/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment */
const ResolveTypescriptPlugin = require('resolve-typescript-plugin')
const path = require('path')

module.exports = {
  "stories": [
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
    if (!config.resolve.plugins) {
      config.resolve.plugins = []
    }
    // Resolve extensions from TS code
    config.resolve.plugins.push(new ResolveTypescriptPlugin())

    // Need to disable this because Arrow v3 has mangled esm; 
    // Remove this when arquero adopts Arrow v8 (https://github.com/uwdata/arquero/pull/277)
    //
    // Note: didn't work in WP5; using WP4 until this is resolved
    //
    // config.resolve.fullySpecified = false

    // run transpiler over monorepo linked projects
    const xformDwc = { ...config.module.rules[0], include: /@data-wrangling-components/, exclude: undefined }
    const xformEssex = { ...config.module.rules[0], include: /@essex\/(arquero|dataflow)/, exclude: undefined }
    const importMeta = {
      test: /\.js$/,
      loader: require.resolve('@open-wc/webpack-import-meta-loader'),
    }
    config.module.rules.push(xformDwc, xformEssex, importMeta)

    return config
  }
}