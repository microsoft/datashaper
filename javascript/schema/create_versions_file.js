/* eslint-disable */
import { writeFileSync } from 'fs'
import pkg from './package.json' assert { type: 'json' }

const { versions } = pkg
writeFileSync(
	'./versions.js',
	`export const versions = ${JSON.stringify(versions)}`,
)
writeFileSync(
	'./versions.d.ts',
	`export declare const versions: {
		${Object.keys(versions)
			.map(v => `${v}: string`)
			.join('\n\t\t')}
	}`,
)
