/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ParseType } from '@datashaper/schema'

import { TestStore } from '../../__tests__/TestStore.js'
import { convertStep } from '../convert.js'

/**
 * Keep this unit test around for deep value conversion inspection
 */
describe('test for convert verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table19')
	})

	describe('single column', () => {
		test('int', () => {
			const result = convertStep(store.table(), {
				column: 'int',
				to: 'newColumn',
				type: ParseType.Integer,
			})

			expect(result.numCols()).toBe(6)
			expect(result.numRows()).toBe(4)
			expect(result.get('newColumn', 0)).toBe(1)
			expect(result.get('newColumn', 1)).toBe(-12)
			expect(result.get('newColumn', 2)).toBe(40098)
			expect(result.get('newColumn', 3)).toBeNaN()
		})

		test('int radix', () => {
			const result = convertStep(store.table(), {
				column: 'int',
				to: 'newColumn',
				type: ParseType.Integer,
				radix: 10,
			})
			expect(result.numCols()).toBe(6)
			expect(result.numRows()).toBe(4)
			expect(result.get('newColumn', 0)).toBe(1)
			expect(result.get('newColumn', 1)).toBe(-12)
			expect(result.get('newColumn', 2)).toBe(40098)
			expect(result.get('newColumn', 3)).toBeNaN()
		})

		test('int hex', () => {
			const result = convertStep(store.table(), {
				column: 'int_hex',
				to: 'newColumn',
				type: ParseType.Integer,
			})

			expect(result.numCols()).toBe(6)
			expect(result.numRows()).toBe(4)
			expect(result.get('newColumn', 0)).toBe(0)
			expect(result.get('newColumn', 1)).toBe(16777215)
			expect(result.get('newColumn', 2)).toBe(255)
			expect(result.get('newColumn', 3)).toBeNaN()
		})

		test('string to date with different formats', () => {
			const result = convertStep(store.table('table23'), {
				column: 'date',
				to: 'newColumn',
				type: ParseType.Date,
			})

			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
			const d1 = new Date(2021, 3, 13)
			const d2 = new Date(2021, 11, 5)
			const d4 = new Date(1996, 0, 1)
			compareDate(result.get('newColumn', 0), d1)
			compareDate(result.get('newColumn', 1), d2)
			expect(result.get('newColumn', 2)).toBeNull()
			compareDate(result.get('newColumn', 3), d4)
			expect(result.get('newColumn', 4)).toBeNull()
		})

		test('number to date', () => {
			const result = convertStep(store.table('table24'), {
				column: 'date',
				to: 'newColumn',
				type: ParseType.Date,
			})

			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)
			const d1 = new Date(1994, 2, 24)
			const d2 = new Date(2020, 5, 23)
			const d3 = new Date(2022, 2, 28)
			compareDate(result.get('newColumn', 0), d1)
			compareDate(result.get('newColumn', 1), d2)
			compareDate(result.get('newColumn', 2), d3)
		})

		test('string null and string undefined to date', () => {
			const result = convertStep(store.table('table25'), {
				column: 'date',
				to: 'newColumn',
				type: ParseType.Date,
			})
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
			const d1 = new Date(2021, 3, 13)
			const d2 = new Date(2021, 11, 5)
			compareDate(result.get('newColumn', 0), d1)
			compareDate(result.get('newColumn', 1), d2)
			expect(result.get('newColumn', 2)).toBeNull()
			expect(result.get('newColumn', 3)).toBeNull()
			expect(result.get('newColumn', 4)).toBeNull()
		})

		test('date to string without format pattern', () => {
			const result = convertStep(store.table('table21'), {
				column: 'date',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(3)
			expect(result.get('newColumn', 0)).toBe('1994-03-24')
			expect(result.get('newColumn', 1)).toBe('2020-06-23')
			expect(result.get('newColumn', 2)).toBe('2022-03-28')
		})

		test('date to string with format pattern', () => {
			const result = convertStep(store.table('table21'), {
				column: 'date',
				to: 'newColumn',
				type: ParseType.String,
				formatPattern: '%B, %Y',
			})
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(3)
			expect(result.get('newColumn', 0)).toBe('March, 1994')
			expect(result.get('newColumn', 1)).toBe('June, 2020')
			expect(result.get('newColumn', 2)).toBe('March, 2022')
		})

		test('string to string with undefined and null values', () => {
			const result = convertStep(store.table('table26'), {
				column: 'values',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBeUndefined()
			expect(result.get('newColumn', 1)).toBe('test1')
			expect(result.get('newColumn', 2)).toBeNull()
			expect(result.get('newColumn', 3)).toBe('test2')
			expect(result.get('newColumn', 4)).toBe('final test')
		})

		test('boolean to string', () => {
			const result = convertStep(store.table('table14'), {
				column: 'z',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(3)
			expect(result.get('newColumn', 0)).toBe('true')
			expect(result.get('newColumn', 1)).toBe('false')
			expect(result.get('newColumn', 2)).toBe('false')
		})

		test('number to string', () => {
			const result = convertStep(store.table('table12'), {
				column: 'totalSale',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBe('54000')
			expect(result.get('newColumn', 1)).toBe('7800')
			expect(result.get('newColumn', 2)).toBe('230000')
			expect(result.get('newColumn', 3)).toBe('20470')
			expect(result.get('newColumn', 4)).toBe('5000')
		})

		test('decimal to string', () => {
			const result = convertStep(store.table('table22'), {
				column: 'value',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBe('12.35')
			expect(result.get('newColumn', 1)).toBe('86.55')
			expect(result.get('newColumn', 2)).toBe('45.55')
			expect(result.get('newColumn', 3)).toBe('66.35')
			expect(result.get('newColumn', 4)).toBe('78.25')
		})

		test('undefined to string', () => {
			const result = convertStep(store.table('table12'), {
				column: 'quantity',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBe('45')
			expect(result.get('newColumn', 1)).toBeNull()
			expect(result.get('newColumn', 2)).toBe('100')
			expect(result.get('newColumn', 3)).toBe('89')
			expect(result.get('newColumn', 4)).toBe('50')
		})

		test('null to string', () => {
			const result = convertStep(store.table('table15'), {
				column: 'y',
				to: 'newColumn',
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(3)
			expect(result.get('newColumn', 0)).toBeNull()
			expect(result.get('newColumn', 1)).toBe('true')
			expect(result.get('newColumn', 2)).toBe('false')
		})

		test('decimal', () => {
			const result = convertStep(store.table(), {
				column: 'decimal',
				to: 'newColumn',
				type: ParseType.Decimal,
			})

			expect(result.numCols()).toBe(6)
			expect(result.numRows()).toBe(4)
			expect(result.get('newColumn', 0)).toBe(1.232)
			expect(result.get('newColumn', 1)).toBe(39488.45)
			expect(result.get('newColumn', 2)).toBe(0.9989)
			expect(result.get('newColumn', 3)).toBeNaN()
		})

		test('boolean', () => {
			const result = convertStep(store.table(), {
				column: 'boolean',
				to: 'newColumn',
				type: ParseType.Boolean,
			})

			expect(result.numCols()).toBe(6)
			expect(result.numRows()).toBe(4)
			expect(result.get('newColumn', 0)).toBe(true)
			expect(result.get('newColumn', 1)).toBe(false)
			expect(result.get('newColumn', 2)).toBe(true)
			expect(result.get('newColumn', 3)).toBe(false)
		})
	})
})

// compare two dates forcing ISO strings
function compareDate(left: Date, right: Date) {
	expect(left.toISOString()).toBe(right.toISOString())
}
