/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataOrientation } from '@datashaper/schema'
import fs from 'fs'

import { readJSONTable } from '../readJSONTable.js'

describe('readJSONTable', () => {
	describe('DataOrientation.Records', () => {
		const json = fs.readFileSync(
			'./src/__tests__/data/companies-records.json',
			{
				encoding: 'utf8',
				flag: 'r',
			},
		)

		it('default orientation', () => {
			const table = readJSONTable(json)
			expect(table.numCols()).toBe(4)
			expect(table.numRows()).toBe(5)
		})

		it('explicit orientation', () => {
			const table = readJSONTable(json, {
				shape: {
					orientation: DataOrientation.Records,
				},
			})
			expect(table.numCols()).toBe(4)
			expect(table.numRows()).toBe(5)
		})
	})

	it('DataOrientation.Columnar', () => {
		const json = fs.readFileSync(
			'./src/__tests__/data/companies-columnar.json',
			{
				encoding: 'utf8',
				flag: 'r',
			},
		)
		const table = readJSONTable(json, {
			shape: {
				orientation: DataOrientation.Columnar,
			},
		})
		expect(table.numCols()).toBe(4)
		expect(table.numRows()).toBe(5)
	})

	describe('DataOrientation.Array', () => {
		const json = fs.readFileSync('./src/__tests__/data/companies-array.json', {
			encoding: 'utf8',
			flag: 'r',
		})

		it('no matrix results in single flat column', () => {
			const table = readJSONTable(json, {
				shape: {
					orientation: DataOrientation.Array,
				},
			})
			expect(table.numCols()).toBe(1)
			expect(table.numRows()).toBe(24)
			expect(table.columnNames()).toEqual(['col1'])
		})

		it('matrix defined', () => {
			const table = readJSONTable(json, {
				shape: {
					orientation: DataOrientation.Array,
					matrix: [6, 4],
				},
			})
			expect(table.numCols()).toBe(4)
			expect(table.numRows()).toBe(5)
			expect(table.columnNames()).toEqual(['ID', 'Name', 'Employees', 'US'])
		})
	})

	it('DataOrientation.Values', () => {
		const json = fs.readFileSync('./src/__tests__/data/companies-values.json', {
			encoding: 'utf8',
			flag: 'r',
		})
		const table = readJSONTable(json, {
			shape: {
				orientation: DataOrientation.Values,
			},
		})
		expect(table.numCols()).toBe(4)
		expect(table.numRows()).toBe(5)
		expect(table.columnNames()).toEqual(['ID', 'Name', 'Employees', 'US'])
	})
})
