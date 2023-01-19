/* eslint-disable */
import { writeFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import pkg from '../javascript/schema/package.json' assert { type: 'json' }
const { versions } = pkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const base = path.join(__dirname, '../javascript/schema')

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
