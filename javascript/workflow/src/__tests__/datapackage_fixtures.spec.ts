/* eslint-disable jest/expect-expect, jest/valid-title, jest/no-conditional-expect */
import { KnownProfile } from '@datashaper/schema'
import fs from 'fs'
import fsp from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { DataPackage } from '../resources/DataPackage/DataPackage.js'
import type { Workflow } from '../resources/index.js'
import type { TableBundle } from '../resources/TableBundle.js'

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
				if (fs.existsSync(path.join(entryPath, '.skip'))) {
					console.log('Skipping test case: ', entryPath)
				} else {
					// If a workflow file exists, define a test case for it
					defineTestCase(targetPath, entry)
				}
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
		const expected = await readJson(path.join(casePath, 'expected.json'))
		let datapackage: DataPackage | undefined
		try {
			datapackage = new DataPackage()
			await datapackage.load(assets)

			expect(datapackage.size).toEqual(expected.tables.length)
			for (const table of expected.tables) {
				const found = datapackage.getResource(table.name) as TableBundle
				expect(found).toBeDefined()

				const workflow = found
					.getSourcesWithProfile(KnownProfile.Workflow)
					.find(t => !!t) as Workflow | undefined
				if (table.workflowLength) {
					expect(workflow).toBeDefined()
					expect(workflow?.length ?? 0).toEqual(table.workflowLength ?? 0)
				}
				expect(found?.output?.table?.numRows()).toEqual(table.rowCount)
				expect(found?.output?.table?.numCols()).toEqual(table.columnCount)
				expect(found?.output?.metadata?.cols).toEqual(found?.output?.table?.numCols())
				expect(found?.output?.metadata?.rows).toEqual(found?.output?.table?.numRows())
			}
			await checkPersisted(await datapackage.save(), expected)
		} finally {
			datapackage?.dispose()
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

async function checkPersisted(files: Map<string, Blob>, expected: any) {
	expect(files).toBeDefined()

	const dpBlob = files.get('datapackage.json')
	expect(dpBlob).toBeDefined()

	const dpJson = JSON.parse(await dpBlob!.text())
	expect(dpJson.resources).toHaveLength(expected.tables.length)

	// const dpLoaded = new DataPackage()
	// expect(() => dpLoaded.load(files)).not.toThrow()
}
