/* eslint-disable */
import { writeFileSync } from 'fs'
import pkg from './package.json' assert { type: 'json' }

const { versions } = pkg
writeFileSync(
	'./versions.js',
	`
	// DO NOT EDIT. THIS FILE IS AUTO-GENERATED DURING BUILD
	export const versions = ${JSON.stringify(versions)}
	`,
)
writeFileSync(
	'./versions.d.ts',
	`
	// DO NOT EDIT. THIS FILE IS AUTO-GENERATED DURING BUILD
	export declare const versions: {
		${Object.keys(versions)
			.map(v => `${v}: string`)
			.join('\n\t\t')}
	}
	`,
)
