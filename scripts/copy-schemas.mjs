/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const latestWorkflowSchema = 'workflow.json'
const schemaDir = path.join(__dirname, '../schema')
const schemaReleases = path.join(schemaDir, 'releases')
const webappVersionDirectory = path.join(
	__dirname,
	'../javascript/webapp/public/schema/workflow',
)

if (!fs.existsSync(webappVersionDirectory)) {
	fs.mkdirSync(webappVersionDirectory)
}

fs.copyFileSync(
	path.join(schemaDir, latestWorkflowSchema),
	path.join(webappVersionDirectory, latestWorkflowSchema),
)

fs.readdirSync(schemaReleases).forEach(file => {
	const renamedFile = file.replace(/workflow-/, '')
	fs.copyFileSync(
		path.join(schemaReleases, file),
		path.join(webappVersionDirectory, renamedFile),
	)
})
