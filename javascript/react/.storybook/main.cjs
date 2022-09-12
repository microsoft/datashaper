/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment */
const ResolveTypescriptPlugin = require('resolve-typescript-plugin')
const path = require('path')

module.exports = {
	stories: [
		path.join(__dirname, '../src/**/*.stories.mdx'),
		path.join(__dirname, '../src/**/*.stories.@(js|jsx|ts|tsx)'),
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: '@storybook/react',
	webpackFinal(config) {
		// mute build output
		if (process.env.CI || process.env.SB_QUIET) {
			config.stats = 'errors-only'
			config.plugins = config.plugins.filter(
				({ constructor }) => constructor.name !== 'ProgressPlugin',
			)
		}

		if (!config.resolve) {
			config.resolve = {}
		}

		// resolve files ending with .ts
		if (!config.resolve.plugins) {
			config.resolve.plugins = []
		}
		// Resolve extensions from TS code
		config.resolve.plugins.push(new ResolveTypescriptPlugin())

		// run transpiler over monorepo linked projects
		const xformDwc = {
			...config.module.rules[0],
			include: /@datashaper/,
			exclude: undefined,
		}
		const xformEssex = {
			...config.module.rules[0],
			include: /@essex/,
			exclude: undefined,
		}
		const importMeta = {
			test: /\.js$/,
			loader: require.resolve('@open-wc/webpack-import-meta-loader'),
		}
		config.module.rules.push(xformDwc, xformEssex, importMeta)
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: 'javascript/auto',
		})
		return config
	},
}
