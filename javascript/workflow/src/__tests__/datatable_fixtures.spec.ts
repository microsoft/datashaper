import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
/* eslint-disable jest/expect-expect, jest/valid-title, jest/no-conditional-expect */
import type { DataTableSchema } from '@datashaper/schema'
import { from } from 'arquero'
import { readDataTable, readJson } from './utils.js'

// Static data paths.
const __dirname = dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = path.join(__dirname, '../../../../schema')
const CASES_PATH = path.join(SCHEMA_PATH, 'fixtures/datatables')

/**
 * Create top-level describes for each test category (top-level folders)
 */
doDescribe(CASES_PATH)

function doDescribe(targetPath: string) {
	const entries = fs.readdirSync(targetPath)
	for (const entry of entries) {
		describe(entry, () => {
			const entryPath = path.join(targetPath, entry)
			if (fs.existsSync(path.join(entryPath, 'datatable.json'))) {
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
		const definition = await readJson(path.join(casePath, 'datatable.json'))
		const expected = await readJsonTable(path.join(casePath, 'expected.json'))
		const table = await readDataTable(casePath, definition as DataTableSchema)
		expect(table?.objects()).toEqual(expected.objects())
	})
}

/**
 * The expectation we're going to go with for these tests is that all of the _expected_ values
 * are in a JSON format that is interpretable with the default arquero read.
 * This allows us to read as default with no schema, since we're testing the schema with the datatable fixtures.
 * @param filePath
 * @returns
 */
async function readJsonTable(filePath: string): Promise<any> {
	return readJson(filePath).then((data) => from(data))
}
