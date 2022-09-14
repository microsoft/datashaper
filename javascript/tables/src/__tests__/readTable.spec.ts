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
			expect(table.numRows()).toBe(9)
			expect(table.numCols()).toBe(3)
		})

		it('should load a large dataset', async () => {
			const table = readTable(largeDataset, {
				comment: '#',
				readRows: 466890,
			})
			expect(table.numRows()).toBe(466890)
		})

		it('should load a large dataset with readRows prop', () => {
			const table = readTable(largeDataset, { readRows: 2 })
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

			expect(table.numRows()).toBe(9)
		})

		it('should load a large dataset', async () => {
			const table = readTable(largeDataset, {
				escapeChar: '$',
				skipBlankLines: true,
				comment: '#',
				readRows: 466890,
			})
			expect(table.numRows()).toBe(466890)
		})

		it('should load a large dataset with readRows prop', () => {
			const table = readTable(text, {
				skipRows: 2,
				escapeChar: '$',
				readRows: 3,
			})
			expect(table.numRows()).toBe(3)
		})

		it('should load a table with custom delimiter', () => {
			const table = readTable(delimiter, {
				header: false,
				delimiter: ':',
				escapeChar: '$',
			})
			expect(table.numRows()).toBe(5)
		})

		it('should load a table with custom delimiter expecting it to guess it', () => {
			const table = readTable(delimiter, { comment: '$', escapeChar: '$' })
			expect(table.numRows()).toBe(4)
		})

		it('should load a table skipping commented line 4 with $ as comment char', () => {
			const table = readTable(altComment, { comment: '$', escapeChar: '$' })
			expect(table.column('first')?.get(3)).toBe('5')
		})
	})
})
