/* eslint-disable */
import { writeFileSync } from 'fs'
import { createRequire } from 'module'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const base = path.join(__dirname, '../javascript/schema')
const { versions } = require('../javascript/schema/package.json')

writeFileSync(
	path.join(base, 'versions.js'),
	`export const versions = ${JSON.stringify(versions)}`,
)
writeFileSync(
	path.join(base, 'versions.d.ts'),
	`export declare const versions: {
		${Object.keys(versions)
			.map((v) => `${v}: string`)
			.join('\n\t\t')}
	}`,
)
