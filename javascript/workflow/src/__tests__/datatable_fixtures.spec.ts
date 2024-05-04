/* eslint-disable jest/expect-expect, jest/valid-title, jest/no-conditional-expect */
import { DataTableSchema } from '@datashaper/schema'
import { readTable } from '@datashaper/tables'
import { from } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table.js'
import fs from 'fs'
import { isArray } from 'lodash-es'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { readJson, readText } from './utils.js'

// Set the root cwd to the package root.
// this makes loading datafiles by file-url in the project more straightforward
process.chdir('../..')

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
		const table = await readDataTable(definition as DataTableSchema, casePath)
		expect(table?.objects()).toEqual(expected.objects())
	})
}

// TODO: this supports the ResourceSchema, paths array; we need to build that into some utilities
async function readDataTable(
	definition: DataTableSchema,
	casePath: string,
): Promise<ColumnTable | undefined> {
	if (!definition.path) {
		return undefined
	}
	const paths = isArray(definition.path) ? definition.path : [definition.path]
	const texts = await Promise.all(
		paths.map((p) => readText(path.join(casePath, p))),
	)
	const allText = texts.join('\n')
	return readTable(allText, definition)
}

/**
 * The expectation we're going to go with for these tests is that all of the _expected_ values
 * are in a JSON format that is interpretable with the default arquero read.
 * This allows us to read as default with no schema, since we're testing the schema with the datatable.
 * @param filePath
 * @returns
 */
async function readJsonTable(filePath: string): Promise<any> {
	return readJson(filePath).then((data) => from(data))
}
