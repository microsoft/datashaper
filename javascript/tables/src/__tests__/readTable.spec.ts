/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataFormat } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import fs from 'fs'

import { readTable } from '../readTable.js'

describe('readTable', () => {
	const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
		encoding: 'utf8',
		flag: 'r',
	})

	const json = fs.readFileSync(
		'./src/__tests__/data/companies-records-strings.json',
		{
			encoding: 'utf8',
			flag: 'r',
		},
	)

	const mixedCsv = `ID
1
2
a`

	const mixedJson = `[{ "ID": "1" }, { "ID": "2" }, { "ID": "a" }]`

	describe('format: csv', () => {
		describe('autotyping', () => {
			it('default without params', async () => {
				const table = (await readTable(csv, {})) as ColumnTable
				expect(table.numCols()).toBe(4)
				expect(table.numRows()).toBe(5)
				expect(typeof table.column('ID')?.get(0)).toBe('number')
				expect(typeof table.column('Name')?.get(0)).toBe('string')
				expect(typeof table.column('Employees')?.get(0)).toBe('number')
				expect(typeof table.column('US')?.get(0)).toBe('boolean')
			})

			describe('autoMax', () => {
				it('default autoMax', async () => {
					const table = (await readTable(mixedCsv, {})) as ColumnTable
					expect(table.numCols()).toBe(1)
					expect(table.numRows()).toBe(3)
					// should fall back to string for the entire column
					expect(typeof table.column('ID')?.get(0)).toBe('string')
				})

				it('limited autoMax', async () => {
					const table = (await readTable(
						mixedCsv,
						{},
						{
							autoMax: 2,
						},
					)) as ColumnTable
					expect(table.numCols()).toBe(1)
					expect(table.numRows()).toBe(3)
					// should not have picked up the string cell
					expect(typeof table.column('ID')?.get(0)).toBe('number')
				})
			})
		})

		describe('no autotyping', () => {
			it('everything is a string', async () => {
				const table = (await readTable(
					csv,
					{},
					{
						autoType: false,
					},
				)) as ColumnTable
				expect(table.numCols()).toBe(4)
				expect(table.numRows()).toBe(5)
				expect(typeof table.column('ID')?.get(0)).toBe('string')
				expect(typeof table.column('Name')?.get(0)).toBe('string')
				expect(typeof table.column('Employees')?.get(0)).toBe('string')
				expect(typeof table.column('US')?.get(0)).toBe('string')
			})
		})
	})

	describe('format: json', () => {
		describe('autotyping', () => {
			it('default without params', async () => {
				const table = (await readTable(json, {
					format: DataFormat.JSON,
				})) as ColumnTable
				expect(table.numCols()).toBe(4)
				expect(table.numRows()).toBe(5)
				expect(typeof table.column('ID')?.get(0)).toBe('number')
				expect(typeof table.column('Name')?.get(0)).toBe('string')
				expect(typeof table.column('Employees')?.get(0)).toBe('number')
				expect(typeof table.column('US')?.get(0)).toBe('boolean')
			})

			describe('autoMax', () => {
				it('default autoMax', async () => {
					const table = (await readTable(mixedJson, {
						format: DataFormat.JSON,
					})) as ColumnTable
					expect(table.numCols()).toBe(1)
					expect(table.numRows()).toBe(3)
					// should fall back to string for the entire column
					expect(typeof table.column('ID')?.get(0)).toBe('string')
				})

				it('limited autoMax', async () => {
					const table = (await readTable(
						mixedJson,
						{
							format: DataFormat.JSON,
						},
						{
							autoMax: 2,
						},
					)) as ColumnTable
					expect(table.numCols()).toBe(1)
					expect(table.numRows()).toBe(3)
					// should not have picked up the string cell
					expect(typeof table.column('ID')?.get(0)).toBe('number')
				})
			})
		})

		describe('no auto-typing', () => {
			it('everything is a string', async () => {
				const table = (await readTable(
					json,
					{
						format: DataFormat.JSON,
					},
					{
						autoType: false,
					},
				)) as ColumnTable
				expect(table.numCols()).toBe(4)
				expect(table.numRows()).toBe(5)
				expect(typeof table.column('ID')?.get(0)).toBe('string')
				expect(typeof table.column('Name')?.get(0)).toBe('string')
				expect(typeof table.column('Employees')?.get(0)).toBe('string')
				expect(typeof table.column('US')?.get(0)).toBe('string')
			})
		})
	})
})
