/* eslint-disable */
import { writeFileSync } from 'fs'
import pkg from './package.json' assert { type: 'json' }

const { versions } = pkg
writeFileSync(
	'./versions.js',
	`export const versions = ${JSON.stringify(versions)}`,
)
