/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { introspect } from '../introspect.js'

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

	describe('introspect', () => {
		test('basic properties are present', () => {
			const result = introspect(tbl)
			expect(result.cols).toEqual(tbl.numCols())
			expect(result.rows).toEqual(tbl.numRows())
			expect(Object.keys(result.columns)).toHaveLength(tbl.numCols())
		})

		test('column subsets are honored', () => {
			const result = introspect(tbl, false, ['num'])
			expect(result.cols).toEqual(tbl.numCols())
			expect(result.rows).toEqual(tbl.numRows())
			expect(Object.keys(result.columns)).toHaveLength(1)
		})
	})
})
