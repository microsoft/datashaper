/* eslint-disable jest/expect-expect, jest/valid-title */
import type { ResourceRelationship } from '@datashaper/schema'
import Blob from 'cross-blob'
import fs from 'fs'
import fsp from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { DataPackage } from '../resources/DataPackage/DataPackage.js'
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
				expect(found?.workflow?.length ?? 0).toEqual(table.workflowLength ?? 0)
				expect(found?.output?.table?.numRows()).toBeGreaterThan(0)
				expect(found?.output?.table?.numCols()).toBeGreaterThan(0)
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
	const dataPackage = JSON.parse(await dpBlob!.text())
	expect(dataPackage.resources).toHaveLength(expected.tables.length)

	for (const table of expected.tables) {
		const tableBlob = files.get(`data/${table.name}/databundle.json`)
		expect(tableBlob).toBeDefined()
		const tableJson = JSON.parse(await tableBlob!.text())

		if (table.workflowLength != null) {
			const wfFile = `data/${table.name}/workflow.json`
			const workflowBlob = files.get(wfFile)
			expect(
				tableJson.sources.map((s: ResourceRelationship) => s.source),
			).toContain(wfFile)
			expect(workflowBlob).toBeDefined()
			const workflowJson = JSON.parse(await workflowBlob!.text())
			expect(workflowJson.steps).toHaveLength(table.workflowLength)
		}
	}
}
