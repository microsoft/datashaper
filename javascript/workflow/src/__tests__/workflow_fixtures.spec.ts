import fs from 'fs'
/* eslint-disable jest/expect-expect, jest/valid-title */
import { createSchemaValidator } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { container } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { jest } from '@jest/globals'
import { Workflow } from '../resources/index.js'
import { readDataTable, readJson } from './utils.js'

// Static data paths.
const __dirname = dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = path.join(__dirname, '../../../../schema')
const CASES_PATH = path.join(SCHEMA_PATH, 'fixtures', 'workflow')

// Json-schema validator
const schema = await readJson(path.join(SCHEMA_PATH, 'workflow.json'))
const ajv = createSchemaValidator()
const validateJson = ajv.compile(schema)

const FLOAT_COMPARISON_DECIMALS = 5

/**
 * Create top-level describes for each test category (top-level folders)
 */
const inputTables = await readInputTables()
doDescribe(CASES_PATH)

// mock out console.log and console.table during tests, this avoids chatty output (including arquero table.print, which uses console.table)
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'table').mockImplementation(() => {})

function doDescribe(targetPath: string) {
	const entries = fs.readdirSync(targetPath)
	for (const entry of entries) {
		describe(entry, () => {
			const entryPath = path.join(targetPath, entry)
			if (fs.existsSync(path.join(entryPath, 'workflow.json'))) {
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
	const jsTablePath = path.join(casePath, 'js')
	const tablesPath = fs.existsSync(jsTablePath) ? jsTablePath : casePath

	const expectedOutputTables = fs
		.readdirSync(tablesPath)
		.filter((f) => f !== 'workflow.json')
		.filter((f) => /\.((csv)|(json))$/.test(f))

	it(testName, async () => {
		// execute the dataflow
		const workflowPath = path.join(casePath, 'workflow.json')
		const workflowJson = await readJson(workflowPath)
		const isWorkflowJsonValid = validateJson(workflowJson) as any
		if (!isWorkflowJsonValid) {
			throw new Error(`invalid workflow definition: ${workflowPath}`)
		}
		const workflow = new Workflow(workflowJson)
		workflow.addInputTables(inputTables)
		// check the output tables
		await Promise.all(
			expectedOutputTables.map(async (entry) => {
				const filename = path.join(tablesPath, entry)
				const expected = await readDataTable(filename)
				await new Promise<void>((resolve) => {
					const tableName = entry.replace(/\.((csv)|(json))$/, '')
					const result = workflow.read(tableName)
					if (result?.table) {
						compareTables(expected, result.table, tableName)
						resolve()
					} else {
						workflow.read$(tableName)?.subscribe((actual) => {
							if (actual?.table) {
								compareTables(expected, actual?.table, tableName)
								resolve()
							}
						})
					}
				})
			}),
		)
	})
}

async function readInputTables(): Promise<TableContainer[]> {
	const inputsPaths = path.join(SCHEMA_PATH, 'fixtures', 'workflow_inputs')
	const entries = fs.readdirSync(inputsPaths)
	return Promise.all(
		entries.map(async (entry) => {
			const tableName = entry.replace(/\.((csv)|(json))$/, '')
			const filename = path.join(inputsPaths, entry)
			const table = await readDataTable(filename)
			return container(tableName, table)
		}),
	)
}

function compareTables(
	expected: ColumnTable | undefined,
	actual: ColumnTable | undefined,
	name: string,
) {
	if (!expected || !actual) {
		throw new Error(`expected output table "${name}" to exist`)
	}

	try {
		expect(actual.numRows()).toEqual(expected.numRows())
		expect(actual.numCols()).toEqual(expected.numCols())
		expect(actual.columnNames()).toEqual(expected.columnNames())

		for (let i = 0; i < actual.numRows(); ++i) {
			for (const column of expected.columnNames()) {
				const actualValue = actual.get(column, i)
				const expectedValue = expected.get(column, i)
				compareValue(expectedValue, actualValue)
			}
		}
	} catch (e) {
		console.log(
			`data mismatch on ${name}; \n-----EXPECTED-----\n${expected.toCSV()}\n\n-----ACTUAL-----\n${actual.toCSV()}`,
		)
		throw e
	}
}

function compareValue(expected: any, actual: any): void {
	if (
		typeof expected === 'number' &&
		!Number.isNaN(expected) &&
		typeof actual === 'number' &&
		!Number.isNaN(actual)
	) {
		expect(actual).toBeCloseTo(expected, FLOAT_COMPARISON_DECIMALS)
	} else if (
		(typeof expected === 'string' && castable[typeof actual]) ||
		(typeof actual === 'string' && castable[typeof expected])
	) {
		// string-cast values to account for mixed-type column data (e.g. fold)
		expect(`${actual}`).toEqual(`${expected}`)
	} else if (typeof expected === 'string' && Array.isArray(actual)) {
		console.log('arrays', expected, actual)
		// Handle array output in actual table
		const parsedArray = expected.split(',')
		expect(parsedArray).toHaveLength(actual.length)
		for (let i = 0; i < parsedArray.length; ++i) {
			compareValue(parsedArray[i], actual[i])
		}
	} else if (expected == null && actual == null) {
		// don't sweat null vs undefined
	} else if (expected === false && actual == null) {
		// don't sweat nullish values for false
	} else if (expected?.getTime != null) {
		const actualDate = new Date(actual)
		expect(expected.getTime()).toEqual(actualDate.getTime())
	} else {
		// comparing unknown types resolves issues with potential auto-typing on the expected csv text versus live types in the workflow output
		expect(actual.toString()).toEqual(expected.toString())
	}
}

const castable: Record<string, boolean> = {
	boolean: true,
	number: true,
}
