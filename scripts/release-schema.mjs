import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import semver from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { version: schemaVersion } = JSON.parse(fs.readFileSync(path.join(__dirname, '../javascript/schema/package.json'), { encoding: 'utf8' }))

console.log("schema version is", schemaVersion)
const currentSchema = path.join(__dirname, '../schema/workflow.json')
const schemaReleases = path.join(__dirname, '../schema/releases')

const majorVersionFile = path.join(schemaReleases, `workflow-v${semver.major(schemaVersion)}.json`)
const specificVersionFile = path.join(schemaReleases, `workflow-v${schemaVersion}.json`)

if (fs.existsSync(specificVersionFile)) {
	throw new Error(`workflow schema version ${schemaVersion} has already been created`)
}
fs.copyFileSync(currentSchema, majorVersionFile)
fs.copyFileSync(currentSchema, specificVersionFile)