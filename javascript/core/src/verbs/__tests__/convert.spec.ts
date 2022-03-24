/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { convertStep } from '../stepFunctions/convert.js'
import { ParseType } from '../types/enums.js'
import { TestStore } from './TestStore.js'

describe('test for convert verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table19')
	})

	describe('single column', () => {
		test('int', () => {
			const result = convertStep(store.table(), {
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

		test('int radix', () => {
			const result = convertStep(store.table(), {
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

		test('int hex', () => {
			const result = convertStep(store.table(), {
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

		test('date', () => {
			const result = convertStep(store.table(), {
				columns: ['date'],
				type: ParseType.Date,
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(4)
			// always compare dates with strict ISO and UTC time
			const d1 = isoDate(2021, 3, 13)
			const d2 = isoDate(2001, 7, 18)
			const d3 = isoDate(1998, 0, 12, 4, 38)
			compareDate(result.get('date', 0), d1)
			compareDate(result.get('date', 1), d2)
			compareDate(result.get('date', 2), d3)
			expect(result.get('date', 3).valueOf()).toBeNaN()
		})

		test('decimal', () => {
			const result = convertStep(store.table(), {
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

		test('boolean', () => {
			const result = convertStep(store.table(), {
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
		test('int', () => {
			const result = convertStep(store.table(), {
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

// force a new date to be UTC instead of default locale
function isoDate(
	year = 0,
	month = 0,
	day = 0,
	hour = 0,
	minute = 0,
	second = 0,
	ms = 0,
): Date {
	const date = new Date()
	date.setUTCFullYear(year)
	date.setUTCMonth(month)
	date.setUTCDate(day)
	date.setUTCHours(hour)
	date.setUTCMinutes(minute)
	date.setUTCSeconds(second)
	date.setUTCMilliseconds(ms)
	return date
}

// compare two dates forcing ISO strings
function compareDate(left: Date, right: Date) {
	expect(left.toISOString()).toBe(right.toISOString())
}
