/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// this script copies the released schemas folder into the webapp public folder for deployment to github.io
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const schemaDir = path.join(__dirname, '../schema')
const schemaReleases = path.join(schemaDir, 'releases')

const { versions } = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../javascript/schema/package.json'), {
		encoding: 'utf8',
	}),
)

Object.keys(versions).forEach((name) => {
	const latestSchema = `${name}.json`

	const releaseDirectory = path.join(schemaReleases, name)

	const webappVersionDirectory = path.join(
		__dirname,
		`../javascript/webapp/public/schema/${name}`,
	)

	if (!fs.existsSync(webappVersionDirectory)) {
		fs.mkdirSync(webappVersionDirectory)
	}

	// copy the latest named schems (no version #)
	fs.copyFileSync(
		path.join(schemaDir, latestSchema),
		path.join(webappVersionDirectory, latestSchema),
	)

	// copy each versioned schema into the appropriate public output folder
	fs.readdirSync(releaseDirectory).forEach((file) => {
		fs.copyFileSync(
			path.join(releaseDirectory, file),
			path.join(webappVersionDirectory, file),
		)
	})
})
