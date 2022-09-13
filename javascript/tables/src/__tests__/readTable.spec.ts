/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { readTable } from '../readTable.js'
import fetch from 'node-fetch'

const text = `first,second,third
1,100,one
2,200,two
3,300,three
#4,400,four
5,500,five`

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

describe('readTable Tests', () => {
	let remoteDataset = ''
	let largeDataset = ''

	beforeAll(async () => {
		remoteDataset = await fetch(
			'https://covid19.who.int/WHO-COVID-19-global-data.csv',
		).then(r => r.text())
		largeDataset = remoteDataset + remoteDataset
	})

	describe('Arquero readCSV tests', () => {
		it('should load a default data without params', () => {
			const table = readTable(text)
			expect(table.numRows()).toBe(4)
			expect(table.numCols()).toBe(3)
		})

		it('should load a large dataset', async () => {
			const table = readTable(largeDataset, {
				comment: '#',
				nRows: 466890,
			})
			expect(table.numRows()).toBe(466890)
		})

		it('should load a large dataset with nRows prop', () => {
			const table = readTable(largeDataset, { nRows: 2 })
			expect(table.numRows()).toBe(2)
		})

		it('should load a table with custom delimiter and names list', () => {
			const table = readTable(delimiter, {
				header: false,
				names: ['first', 'second', 'third'],
				delimiter: ':',
			})
			expect(table.numRows()).toBe(5)
		})

		it('should load a table with custom delimiter expecting it to guess it', () => {
			const table = readTable(delimiter, { comment: '$' })
			expect(table.numRows()).toBe(4)
		})

		it('should load a table skipping commented line 4 with $ as comment char', () => {
			const table = readTable(altComment, { comment: '$' })
			expect(table.column('first')?.get(3)).toBe('5')
		})
	})

	describe('Papa Parse readCSV tests', () => {
		it('should load a table ', async () => {
			const table = readTable(text, {
				escapeChar: '$',
				comment: '#',
			})

			expect(table.data.length).toBe(4)
		})

		it('should load a large dataset', async () => {
			const table = readTable(largeDataset, {
				escapeChar: '$',
				skipBlankLines: true,
				comment: '#',
				nRows: 466890,
			})
			expect(table.data.length).toBe(466890)
		})

		it('should load a large dataset with nRows prop', () => {
			const table = readTable(largeDataset, {
				skipRows: 2,
				escapeChar: '$',
				nRows: 3,
			})
			expect(table.data.length).toBe(1)
		})

		it('should load a table with custom delimiter', () => {
			const table = readTable(delimiter, {
				header: false,
				delimiter: ':',
				escapeChar: '$',
			})
			expect(table.data.length).toBe(5)
		})

		it('should load a table with custom delimiter expecting it to guess it', () => {
			const table = readTable(delimiter, { comment: '$', escapeChar: '$' })
			expect(table.data.length).toBe(4)
		})

		it('should load a table skipping commented line 4 with $ as comment char', () => {
			const table = readTable(altComment, { comment: '$', escapeChar: '$' })
			expect(table.data[3].first).toBe('5')
		})
	})
})
