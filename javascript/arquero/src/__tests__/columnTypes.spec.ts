/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { columnTypes } from '../columnTypes.js'

describe('table utilities', () => {
	// note: all columns must be the same length or missing will be padded with empty cells
	// empty cells will count as one extra distinct value
	const d1 = new Date('2020-01-01')
	const d2 = new Date('2020-01-02')
	const tbl: ColumnTable = table({
		num: [1, 2, 3, 3, 4, 5],
		str: ['A', 'B', 'B', 'B', 'C', 'D'],
		inv: [1, 2],
		bool: [true, true, false, false, true],
		date: [d1, d2],
		arr: [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		],
	})

	describe('columnTypes', () => {
		test('types are correct for all columns', () => {
			const result = columnTypes(tbl)
			expect(Object.keys(result)).toEqual(tbl.columnNames())
			expect(result.num).toBe('number')
			expect(result.str).toBe('string')
			expect(result.inv).toBe('number')
			expect(result.bool).toBe('boolean')
			expect(result.date).toBe('date')
			expect(result.arr).toBe('array')
		})

		test('column subsets are honored', () => {
			const subset = columnTypes(tbl, ['num', 'str'])
			expect(Object.keys(subset)).toEqual(['num', 'str'])
		})
	})
})
