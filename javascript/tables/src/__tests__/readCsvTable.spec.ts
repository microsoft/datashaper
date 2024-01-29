/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs'
import fetch from 'node-fetch'

import { readCsvTable } from '../readCsvTable.js'

const text = `first,second,third
1,100,one
2,200,two
3,300,three
#4,400,four
5,500,five
6,600,six
7,700,seven
8,800,eight
9,900,nine
10,1000,ten`

const altComment = `first,second,third
1,100,one
$2,200,two
3,300,three
4,400,four
5,500,five`

const delimiter = `1:100:one
2:200:two
3:300:three
4:400:four
5:500:five`

describe('readCsvTable', () => {
	describe('arquero reader', () => {
		it('default without params', () => {
			const table = readCsvTable(text)
			expect(table.numRows()).toBe(10)
			expect(table.numCols()).toBe(3)
		})

		it('skips commented lines', () => {
			const table = readCsvTable(text, {
				parser: {
					comment: '#',
				},
			})
			expect(table.numRows()).toBe(9)
			expect(table.numCols()).toBe(3)
		})

		it('custom delimiter and names list', () => {
			const table = readCsvTable(delimiter, {
				parser: {
					header: false,
					names: ['first', 'second', 'third'],
					delimiter: ':',
				},
			})
			expect(table.numRows()).toBe(5)
		})

		// TODO: I think we want to remove this or use the papa guess
		it('custom delimiter expecting it to guess it', () => {
			const table = readCsvTable(delimiter)
			expect(table.numRows()).toBe(4)
		})

		it('skipping commented line 4 with $ as comment char', () => {
			const table = readCsvTable(altComment, {
				parser: { comment: '$' },
			})
			expect(table.column('first')?.get(3)).toBe('5')
		})

		it('no autotyping', () => {
			const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
				encoding: 'utf8',
				flag: 'r',
			})
			const table = readCsvTable(csv)
			expect(typeof table.column('ID')?.get(0)).toBe('string')
			expect(typeof table.column('Name')?.get(0)).toBe('string')
			expect(typeof table.column('Employees')?.get(0)).toBe('string')
			expect(typeof table.column('US')?.get(0)).toBe('string')
		})
		describe('headerless csv', () => {
			const csv = fs.readFileSync(
				'./src/__tests__/data/companies-headerless.csv',
				{
					encoding: 'utf8',
					flag: 'r',
				},
			)

			it('default column names', () => {
				const table = readCsvTable(csv, {
					parser: { header: false },
				})
				expect(table.columnNames()).toEqual(['col1', 'col2', 'col3', 'col4'])
			})

			it('specified column names', () => {
				const table = readCsvTable(csv, {
					parser: {
						header: false,
						names: ['A', 'B', 'C', 'D'],
					},
				})
				expect(table.columnNames()).toEqual(['A', 'B', 'C', 'D'])
			})
		})
	})

	describe('papaparse reader', () => {
		it('should load a table', () => {
			const table = readCsvTable(text, {
				parser: {
					escapeChar: '$',
					comment: '#',
				},
			})

			expect(table.numRows()).toBe(9)
		})

		it('custom delimiter', () => {
			const table = readCsvTable(delimiter, {
				parser: {
					header: false,
					delimiter: ':',
					escapeChar: '$',
				},
			})
			expect(table.numRows()).toBe(5)
		})

		it('custom delimiter expecting it to guess it', () => {
			const table = readCsvTable(delimiter, {
				parser: { comment: '$', escapeChar: '$' },
			})
			expect(table.numRows()).toBe(4)
		})

		it('skipping commented line 4 with $ as comment char', () => {
			const table = readCsvTable(altComment, {
				parser: { comment: '$', escapeChar: '$' },
			})
			expect(table.column('first')?.get(3)).toBe('5')
		})

		it('no autotyping', () => {
			const csv = fs.readFileSync('./src/__tests__/data/companies.csv', {
				encoding: 'utf8',
				flag: 'r',
			})
			const table = readCsvTable(csv, {
				parser: {
					// force papa with a non-arquero param
					escapeChar: '$',
				},
			})
			expect(typeof table.column('ID')?.get(0)).toBe('string')
			expect(typeof table.column('Name')?.get(0)).toBe('string')
			expect(typeof table.column('Employees')?.get(0)).toBe('string')
			expect(typeof table.column('US')?.get(0)).toBe('string')
		})

		describe('headerless csv', () => {
			const csv = fs.readFileSync(
				'./src/__tests__/data/companies-headerless.csv',
				{
					encoding: 'utf8',
					flag: 'r',
				},
			)

			it('default column names', () => {
				const table = readCsvTable(csv, {
					parser: { header: false, escapeChar: '$' },
				})
				expect(table.columnNames()).toEqual(['col1', 'col2', 'col3', 'col4'])
			})

			it('specified column names', () => {
				const table = readCsvTable(csv, {
					parser: {
						header: false,
						names: ['A', 'B', 'C', 'D'],
						escapeChar: '$',
					},
				})
				expect(table.columnNames()).toEqual(['A', 'B', 'C', 'D'])
			})
		})
		describe('json csv', () => {
			const csv = fs.readFileSync(
				'./src/__tests__/data/column-json.csv',
				{
					encoding: 'utf8',
					flag: 'r',
				},
			)

			it('column names', () => {
				const table = readCsvTable(csv)
				expect(table.columnNames()).toEqual(['ID', 'item', 'quantity', 'info'])
			})
		})
	})

	describe('Large tables', () => {
		let remoteDataset = ''
		let largeDataset = ''

		beforeAll(async () => {
			remoteDataset = await fetch(
				'https://covid19.who.int/WHO-COVID-19-global-data.csv',
			).then((r) => r.text())
			largeDataset = remoteDataset + remoteDataset
			while (largeDataset.split('\n').length < 466890) {
				// Double size if it's not big enough
				largeDataset = largeDataset + largeDataset
			}
		})

		describe('arquero reader', () => {
			it('should load a large dataset', () => {
				const table = readCsvTable(largeDataset, {
					parser: {
						readRows: 466890,
					},
				})
				expect(table.numRows()).toBe(466890)
			})
		})

		describe('papaparse reader', () => {
			it('large dataset', () => {
				const table = readCsvTable(largeDataset, {
					parser: {
						escapeChar: '$',
						readRows: 466890,
					},
				})
				expect(table.numRows()).toBe(466890)
			})

			it('large dataset with readRows prop', () => {
				const table = readCsvTable(largeDataset, {
					parser: {
						skipRows: 2,
						escapeChar: '$',
						readRows: 3,
					},
				})
				expect(table.numRows()).toBe(3)
			})
		})
	})
})
