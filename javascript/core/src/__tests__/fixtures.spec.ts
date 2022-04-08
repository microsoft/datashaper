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

const RESULT_TABLE = 'result'

const __dirname = dirname(fileURLToPath(import.meta.url))

const categoriesPath = path.join(__dirname, '../../../../schema/fixtures/cases')
const inputTablesPath = path.join(
	__dirname,
	'../../../../schema/fixtures/inputs',
)
const categories = fs.readdirSync(categoriesPath)
const sourceTables = fs.readdirSync(inputTablesPath)
const tables = sourceTables.map(st => {
	const text = fs.readFileSync(path.join(inputTablesPath, st), 'utf8')
	const table = arquero.fromCSV(text)
	return container(st.replace('.csv', ''), table)
})

categories.forEach(category =>
	describe(category, () => {
		const cases = fs.readdirSync(path.join(categoriesPath, category))
		cases.forEach(caseName => {
			const casePath = path.join(categoriesPath, category, caseName)
			it(caseName.split('_').join(' '), async () => {
				const workflow = (await import(path.join(casePath, 'workflow.json')))
					.default
				const expectedCsv = await fsp.readFile(
					path.join(casePath, 'expected.csv'),
					'utf8',
				)
				const tableStore = createTableStore(tables)
				const expected = arquero.fromCSV(expectedCsv)

				createGraph(workflow.steps.map(step), tableStore)
				const result = tableStore.get(RESULT_TABLE)

				compareTables(expected, result!.table!)
			})
		})
	}),
)

function compareTables(expected: ColumnTable, result: ColumnTable) {
	expect(result.numRows()).toEqual(expected.numRows())
	expect(result.numCols()).toEqual(expected.numCols())
	expect(result.columnNames()).toEqual(expected.columnNames())

	for (let i = 0; i < result.numRows(); ++i) {
		for (const column of expected.columnNames()) {
			expect(result.get(column, i)).toEqual(expected.get(column, i))
		}
	}
}
