/* eslint-disable jest/expect-expect, jest/valid-title */
import { Blob } from 'buffer'
import fs from 'fs'
import fsp from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { DataPackage } from '../resources/DataPackage.js'

// Set the root cwd to the package root.
// this makes loading datafiles by file-url in the project more straightforward
process.chdir('../..')

// Static data paths.
const __dirname = dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = path.join(__dirname, '../../../../schema')
const CASES_PATH = path.join(SCHEMA_PATH, 'fixtures/datapackages')

/**
 * Create top-level describes for each test category (top-level folders)
 */
doDescribe(CASES_PATH)

function doDescribe(targetPath: string) {
	const entries = fs.readdirSync(targetPath)
	for (const entry of entries) {
		describe(entry, () => {
			const entryPath = path.join(targetPath, entry)
			if (fs.existsSync(path.join(entryPath, 'datapackage.json'))) {
				// If a workflow file exists, define a test case for it
				defineTestCase(targetPath, entry)
			} else {
				// Otherwise; keep describing down until we find test cases
				doDescribe(entryPath)
			}
		})
	}
}

function defineTestCase(parentPath: string, test: string) {
	const casePath = path.join(parentPath, test)
	const testName = test.split('_').join(' ')

	it(testName, async () => {
		const assets = await readDataPackageFiles(casePath)
		const datapackageSchema = await readJson(
			path.join(casePath, 'datapackage.json'),
		)
		const expected = await readJson(path.join(casePath, 'expected.json'))
		const datapackage = new DataPackage(datapackageSchema, assets as any)
		await datapackage.initialize()

		expect(datapackage.size).toEqual(expected.tables.length)
		for (const table of expected.tables) {
			const found = datapackage.get(table.name)
			expect(found).toBeDefined()
			expect(found?.workflow.length).toEqual(table.workflowLength ?? 0)
			expect(found?.currentOutput?.table?.numRows()).toBeGreaterThan(0)
			expect(found?.currentOutput?.table?.numCols()).toBeGreaterThan(0)
		}
	})
}

async function readJson(filePath: string): Promise<any> {
	return JSON.parse(await fsp.readFile(filePath, 'utf8'))
}

async function readDataPackageFiles(
	casePath: string,
	results = new Map<string, Blob>(),
	root = '',
): Promise<Map<string, Blob>> {
	const entries = fs.readdirSync(casePath)
	for (const entry of entries) {
		const entryPath = path.join(casePath, entry)
		const stat = fs.statSync(entryPath)
		if (stat.isFile()) {
			const blob = await fsp.readFile(entryPath)
			results.set(path.join(root, entry), new Blob([blob]))
		} else if (stat.isDirectory()) {
			await readDataPackageFiles(entryPath, results, path.join(root, entry))
		}
	}
	return results
}
