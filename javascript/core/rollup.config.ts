// rollup.config.js
import { defineConfig, ExternalOption } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

const config = defineConfig({
	input: './src/index.ts',
	external: ['node-fetch', 'apache-arrow'],
	output: {
		format: 'esm',
		file: './dist/worker.js',
		globals: {},
	},
	plugins: [nodeResolve(), typescript(), json()],
})
export default config
