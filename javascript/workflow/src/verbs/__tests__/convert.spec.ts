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
		test('int', async () => {
			const result = await convertStep(store.table(), {
				columns: ['int'],
				type: ParseType.Integer,
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			expect(result.get('int', 0)).toBe(1)
			expect(result.get('int', 1)).toBe(-12)
			expect(result.get('int', 2)).toBe(40098)
			expect(result.get('int', 3)).toBeNaN()
		})

		test('int radix', async () => {
			const result = await convertStep(store.table(), {
				columns: ['int'],
				type: ParseType.Integer,
				radix: 10,
			})
			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			expect(result.get('int', 0)).toBe(1)
			expect(result.get('int', 1)).toBe(-12)
			expect(result.get('int', 2)).toBe(40098)
			expect(result.get('int', 3)).toBeNaN()
		})

		test('int hex', async () => {
			const result = await convertStep(store.table(), {
				columns: ['int_hex'],
				type: ParseType.Integer,
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			expect(result.get('int_hex', 0)).toBe(0)
			expect(result.get('int_hex', 1)).toBe(16777215)
			expect(result.get('int_hex', 2)).toBe(255)
			expect(result.get('int_hex', 3)).toBeNaN()
		})

		test('string to date with different formats', async () => {
			const result = await convertStep(store.table('table23'), {
				columns: ['date'],
				type: ParseType.Date,
			})

			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(5)
			const d1 = new Date(2021, 3, 13)
			const d2 = new Date(2021, 11, 5)
			const d4 = new Date(1996, 0, 1)
			compareDate(result.get('date', 0), d1)
			compareDate(result.get('date', 1), d2)
			expect(result.get('date', 2)).toBeNull()
			compareDate(result.get('date', 3), d4)
			expect(result.get('date', 4)).toBeNull()
		})

		test('number to date', async () => {
			const result = await convertStep(store.table('table24'), {
				columns: ['date'],
				type: ParseType.Date,
			})

			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(3)
			const d1 = new Date(1994, 2, 24)
			const d2 = new Date(2020, 5, 23)
			const d3 = new Date(2022, 2, 28)
			compareDate(result.get('date', 0), d1)
			compareDate(result.get('date', 1), d2)
			compareDate(result.get('date', 2), d3)
		})

		test('string null and string undefined to date', async () => {
			const result = await convertStep(store.table('table25'), {
				columns: ['date'],
				type: ParseType.Date,
			})
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(5)
			const d1 = new Date(2021, 3, 13)
			const d2 = new Date(2021, 11, 5)
			compareDate(result.get('date', 0), d1)
			compareDate(result.get('date', 1), d2)
			expect(result.get('date', 2)).toBeNull()
			expect(result.get('date', 3)).toBeNull()
			expect(result.get('date', 4)).toBeNull()
		})

		test('date to string without format pattern', async () => {
			const result = await convertStep(store.table('table21'), {
				columns: ['date'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(1)
			expect(result.numRows()).toBe(3)
			expect(result.get('date', 0)).toBe('1994-03-24')
			expect(result.get('date', 1)).toBe('2020-06-23')
			expect(result.get('date', 2)).toBe('2022-03-28')
		})

		test('date to string with format pattern', async () => {
			const result = await convertStep(store.table('table21'), {
				columns: ['date'],
				type: ParseType.String,
				formatPattern: '%B, %Y',
			})
			expect(result.numCols()).toBe(1)
			expect(result.numRows()).toBe(3)
			expect(result.get('date', 0)).toBe('March, 1994')
			expect(result.get('date', 1)).toBe('June, 2020')
			expect(result.get('date', 2)).toBe('March, 2022')
		})

		test('string to string with undefined and null values', async () => {
			const result = await convertStep(store.table('table26'), {
				columns: ['values'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(5)
			expect(result.get('values', 0)).toBeUndefined()
			expect(result.get('values', 1)).toBe('test1')
			expect(result.get('values', 2)).toBeNull()
			expect(result.get('values', 3)).toBe('test2')
			expect(result.get('values', 4)).toBe('final test')
		})

		test('boolean to string', async () => {
			const result = await convertStep(store.table('table14'), {
				columns: ['z'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)
			expect(result.get('z', 0)).toBe('true')
			expect(result.get('z', 1)).toBe('false')
			expect(result.get('z', 2)).toBe('false')
		})

		test('number to string', async () => {
			const result = await convertStep(store.table('table12'), {
				columns: ['totalSale'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('totalSale', 0)).toBe('54000')
			expect(result.get('totalSale', 1)).toBe('7800')
			expect(result.get('totalSale', 2)).toBe('230000')
			expect(result.get('totalSale', 3)).toBe('20470')
			expect(result.get('totalSale', 4)).toBe('5000')
		})

		test('decimal to string', async () => {
			const result = await convertStep(store.table('table22'), {
				columns: ['value'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(5)
			expect(result.get('value', 0)).toBe('12.35')
			expect(result.get('value', 1)).toBe('86.55')
			expect(result.get('value', 2)).toBe('45.55')
			expect(result.get('value', 3)).toBe('66.35')
			expect(result.get('value', 4)).toBe('78.25')
		})

		test('undefined to string', async () => {
			const result = await convertStep(store.table('table12'), {
				columns: ['quantity'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('quantity', 0)).toBe('45')
			expect(result.get('quantity', 1)).toBeNull()
			expect(result.get('quantity', 2)).toBe('100')
			expect(result.get('quantity', 3)).toBe('89')
			expect(result.get('quantity', 4)).toBe('50')
		})

		test('null to string', async () => {
			const result = await convertStep(store.table('table15'), {
				columns: ['y'],
				type: ParseType.String,
			})
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(3)
			expect(result.get('y', 0)).toBeNull()
			expect(result.get('y', 1)).toBe('true')
			expect(result.get('y', 2)).toBe('false')
		})

		test('decimal', async () => {
			const result = await convertStep(store.table(), {
				columns: ['decimal'],
				type: ParseType.Decimal,
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			expect(result.get('decimal', 0)).toBe(1.232)
			expect(result.get('decimal', 1)).toBe(39488.45)
			expect(result.get('decimal', 2)).toBe(0.9989)
			expect(result.get('decimal', 3)).toBeNaN()
		})

		test('boolean', async () => {
			const result = await convertStep(store.table(), {
				columns: ['boolean'],
				type: ParseType.Boolean,
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			expect(result.get('boolean', 0)).toBe(true)
			expect(result.get('boolean', 1)).toBe(false)
			expect(result.get('boolean', 2)).toBe(true)
			expect(result.get('boolean', 3)).toBe(false)
		})
	})

	describe('multi column', () => {
		test('int', async () => {
			const result = await convertStep(store.table(), {
				columns: ['int', 'int_hex'],
				type: ParseType.Integer,
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			expect(result.get('int', 0)).toBe(1)
			expect(result.get('int', 1)).toBe(-12)
			expect(result.get('int', 2)).toBe(40098)
			expect(result.get('int', 3)).toBeNaN()
			expect(result.get('int_hex', 0)).toBe(0)
			expect(result.get('int_hex', 1)).toBe(16777215)
			expect(result.get('int_hex', 2)).toBe(255)
			expect(result.get('int_hex', 3)).toBeNaN()
		})
	})
})

// compare two dates forcing ISO strings
function compareDate(left: Date, right: Date) {
	expect(left.toISOString()).toBe(right.toISOString())
}
