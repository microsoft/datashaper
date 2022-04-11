/* eslint-disable jest/expect-expect, jest/valid-title */

import arquero from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import fs from 'fs'
import fsp from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { createGraph } from '../engine/graph.js'
import { step } from '../steps/step.js'
import { createTableStore } from '../store/createTableStore.js'
import { container } from '../tables/container.js'
import type { TableContainer } from '../tables/types.js'

// Static data paths
const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURES_PATH = path.join(__dirname, '../../../../schema/fixtures')
const CATEGORIES_PATH = path.join(FIXTURES_PATH, 'cases')

/**
 * Create top-level describes for each test category (top-level folders)
 */
fs.readdirSync(CATEGORIES_PATH).forEach(category =>
	describe(category, () => {
		const categoryPath = path.join(CATEGORIES_PATH, category)
		/**
		 * Create a test case for each nested folder
		 */
		fs.readdirSync(categoryPath).forEach(caseName =>
			defineTestCase(category, caseName),
		)
	}),
)

function defineTestCase(category: string, test: string) {
	const casePath = path.join(CATEGORIES_PATH, category, test)
	const testName = test.split('_').join(' ')
	const expectedOutputTables = fs
		.readdirSync(casePath)
		.filter(f => f.endsWith('.csv'))
		.map(f => f.replace('.csv', ''))

	it(testName, async () => {
		// execute the dataflow
		const tableStore = createTableStore(await readInputTables())
		const workflowJson = await readJson(path.join(casePath, 'workflow.json'))
		createGraph(workflowJson.steps.map(step), tableStore)

		// check the output tables
		for (const o of expectedOutputTables) {
			const actual = tableStore.get(o)
			const expected = await readCsv(path.join(casePath, `${o}.csv`))
			compareTables(expected, actual?.table, o)
		}
	})
}

async function readInputTables(): Promise<TableContainer[]> {
	const inputsPaths = path.join(FIXTURES_PATH, 'inputs')
	const entries = fs.readdirSync(inputsPaths)
	return Promise.all(
		entries.map(async entry => {
			const tableName = entry.replace('.csv', '')
			const dataPath = path.join(inputsPaths, entry)
			return container(tableName, await readCsv(dataPath))
		}),
	)
}

function readJson(dataPath: string): Promise<any> {
	return import(dataPath).then(res => res.default)
}

function readText(dataPath: string): Promise<string> {
	return fsp.readFile(dataPath, 'utf8')
}

function readCsv(dataPath: string): Promise<ColumnTable> {
	return readText(dataPath).then(txt => arquero.fromCSV(txt))
}

function compareTables(
	expected: ColumnTable,
	actual: ColumnTable | undefined,
	name: string,
) {
	if (!actual) {
		throw new Error(`expected output table "${name}" to exist`)
	}
	expect(actual.numRows()).toEqual(expected.numRows())
	expect(actual.numCols()).toEqual(expected.numCols())
	expect(actual.columnNames()).toEqual(expected.columnNames())

	for (let i = 0; i < actual.numRows(); ++i) {
		for (const column of expected.columnNames()) {
			try {
				expect(actual.get(column, i)).toEqual(expected.get(column, i))
			} catch (e) {
				console.log(
					`data mismatch; \n-----EXPECTED-----\n${expected.toCSV()}\n\n-----ACTUAL-----\n${actual.toCSV()}`,
				)
				throw e
			}
		}
	}
}
