/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import path, { dirname } from 'path'
import semver from 'semver'
import { fileURLToPath } from 'url'

// this script copies the latest built version of the schema into a releases folder with rolled up version specificity
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const schemaReleases = path.join(__dirname, '../schema/releases')

const { versions } = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../javascript/schema/package.json'), {
		encoding: 'utf8',
	}),
)

Object.entries(versions).forEach(([name, schemaVersion]) => {
	const currentSchema = path.join(__dirname, `../schema/${name}.json`)
	const schemaFolder = path.join(schemaReleases, name)
	if (!fs.existsSync(schemaFolder)) {
		fs.mkdirSync(schemaFolder)
	}
	const majorVersionFile = path.join(
		schemaFolder,
		`v${semver.major(schemaVersion)}.json`,
	)
	const specificVersionFile = path.join(schemaFolder, `v${schemaVersion}.json`)
	fs.copyFileSync(currentSchema, majorVersionFile)
	fs.copyFileSync(currentSchema, specificVersionFile)
})
