/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const ResolveTypescriptPlugin = require('resolve-typescript-plugin')
const path = require('path')

module.exports = {
	stories: ['../../*/src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
	staticDirs: [path.join(__dirname, '../../react/src/__tests__/public')],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: '@storybook/react',
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			compilerOptions: {
				allowSyntheticDefaultImports: false,
				esModuleInterop: false,
			},
		},
	},
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

		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'styled-components': require.resolve('styled-components'),
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
		const xformFetchBlob = {
			...config.module.rules[0],
			include: /fetch-blob/,
			exclude: undefined,
		}
		const importMeta = {
			test: /\.js$/,
			loader: require.resolve('@open-wc/webpack-import-meta-loader'),
		}
		config.module.rules.push(xformDwc, xformEssex, xformFetchBlob, importMeta)
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: 'javascript/auto',
		})

		return config
	},
}
