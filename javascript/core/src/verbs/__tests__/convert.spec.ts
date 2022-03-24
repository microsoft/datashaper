/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { ParseType, Verb } from '../../types.js'
import { convert } from '../stepFunctions/convert.js'
import { TestStore } from './TestStore.js'

describe('test for convert verb', () => {
	describe('single column', () => {
		test('int', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['int'],
					type: ParseType.Integer,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				expect(result.table!.get('int', 0)).toBe(1)
				expect(result.table!.get('int', 1)).toBe(-12)
				expect(result.table!.get('int', 2)).toBe(40098)
				expect(result.table!.get('int', 3)).toBeNaN()
			})
		})

		test('int radix', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['int'],
					type: ParseType.Integer,
					radix: 10,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				expect(result.table!.get('int', 0)).toBe(1)
				expect(result.table!.get('int', 1)).toBe(-12)
				expect(result.table!.get('int', 2)).toBe(40098)
				expect(result.table!.get('int', 3)).toBeNaN()
			})
		})

		test('int hex', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['int_hex'],
					type: ParseType.Integer,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				expect(result.table!.get('int_hex', 0)).toBe(0)
				expect(result.table!.get('int_hex', 1)).toBe(16777215)
				expect(result.table!.get('int_hex', 2)).toBe(255)
				expect(result.table!.get('int_hex', 3)).toBeNaN()
			})
		})

		test('date', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['date'],
					type: ParseType.Date,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				// always compare dates with strict ISO and UTC time
				const d1 = isoDate(2021, 3, 13)
				const d2 = isoDate(2001, 7, 18)
				const d3 = isoDate(1998, 0, 12, 4, 38)
				compareDate(result.table!.get('date', 0), d1)
				compareDate(result.table!.get('date', 1), d2)
				compareDate(result.table!.get('date', 2), d3)
				expect(result.table!.get('date', 3).valueOf()).toBeNaN()
			})
		})

		test('decimal', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['decimal'],
					type: ParseType.Decimal,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				expect(result.table!.get('decimal', 0)).toBe(1.232)
				expect(result.table!.get('decimal', 1)).toBe(39488.45)
				expect(result.table!.get('decimal', 2)).toBe(0.9989)
				expect(result.table!.get('decimal', 3)).toBeNaN()
			})
		})

		test('boolean', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['boolean'],
					type: ParseType.Boolean,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				expect(result.table!.get('boolean', 0)).toBe(true)
				expect(result.table!.get('boolean', 1)).toBe(false)
				expect(result.table!.get('boolean', 2)).toBe(true)
				expect(result.table!.get('boolean', 3)).toBe(false)
			})
		})
	})

	describe('multi column', () => {
		test('int', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table19',
				output: 'output',
				args: {
					columns: ['int', 'int_hex'],
					type: ParseType.Integer,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(5)
				expect(result.table!.numRows()).toBe(4)
				expect(result.table!.get('int', 0)).toBe(1)
				expect(result.table!.get('int', 1)).toBe(-12)
				expect(result.table!.get('int', 2)).toBe(40098)
				expect(result.table!.get('int', 3)).toBeNaN()
				expect(result.table!.get('int_hex', 0)).toBe(0)
				expect(result.table!.get('int_hex', 1)).toBe(16777215)
				expect(result.table!.get('int_hex', 2)).toBe(255)
				expect(result.table!.get('int_hex', 3)).toBeNaN()
			})
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
