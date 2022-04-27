// rollup.config.js
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

const config = defineConfig({
	input: './src/index.ts',
	external: ['apache-arrow', 'node-fetch'],
	output: {
		format: 'esm',
		file: './dist/worker.js',
		globals: {
			'node-fetch': 'fetch',
		},
	},
	plugins: [nodeResolve(), typescript(), json()],
})
export default config
