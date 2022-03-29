/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { ParseType, Verb } from '../../types.js'
import { convert } from '../verbs/convert.js'
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

		test('string to date with different formats', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table23',
				output: 'output',
				args: {
					columns: ['date'],
					type: ParseType.Date,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(2)
				expect(result.table!.numRows()).toBe(5)
				// always compare dates with strict ISO and UTC time
				const d1 = isoDate(2021, 3, 13)
				const d2 = isoDate(2021, 11, 5)
				const d4 = isoDate(1996, 0, 1)
				compareDate(result.table!.get('date', 0), d1)
				compareDate(result.table!.get('date', 1), d2)
				expect(result.table!.get('date', 2)).toBeNull()
				compareDate(result.table!.get('date', 3), d4)
				expect(result.table!.get('date', 4)).toBeNull()
			})
		})

		test('number to date', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table24',
				output: 'output',
				args: {
					columns: ['date'],
					type: ParseType.Date,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(2)
				expect(result.table!.numRows()).toBe(3)
				const d1 = isoDate(1994, 2, 24)
				const d2 = isoDate(2020, 5, 23)
				const d3 = isoDate(2022, 2, 28)
				compareDate(result.table!.get('date', 0), d1)
				compareDate(result.table!.get('date', 1), d2)
				compareDate(result.table!.get('date', 2), d3)
			})
		})

		test('date to string without format pattern', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table21',
				output: 'output',
				args: {
					columns: ['date'],
					type: ParseType.String,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(1)
				expect(result.table!.numRows()).toBe(3)
				expect(result.table!.get('date', 0)).toBe('03-24-1994')
				expect(result.table!.get('date', 1)).toBe('06-23-2020')
				expect(result.table!.get('date', 2)).toBe('03-28-2022')
			})
		})

		test('date to string with format pattern', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table21',
				output: 'output',
				args: {
					columns: ['date'],
					type: ParseType.String,
					formatPattern: '%B, %Y',
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(1)
				expect(result.table!.numRows()).toBe(3)
				expect(result.table!.get('date', 0)).toBe('March, 1994')
				expect(result.table!.get('date', 1)).toBe('June, 2020')
				expect(result.table!.get('date', 2)).toBe('March, 2022')
			})
		})

		test('boolean to string', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table14',
				output: 'output',
				args: {
					columns: ['z'],
					type: ParseType.String,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(3)
				expect(result.table!.numRows()).toBe(3)
				expect(result.table!.get('z', 0)).toBe('true')
				expect(result.table!.get('z', 1)).toBe('false')
				expect(result.table!.get('z', 2)).toBe('false')
			})
		})

		test('number to string', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['totalSale'],
					type: ParseType.String,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(4)
				expect(result.table!.numRows()).toBe(5)
				expect(result.table!.get('totalSale', 0)).toBe('54000')
				expect(result.table!.get('totalSale', 1)).toBe('7800')
				expect(result.table!.get('totalSale', 2)).toBe('230000')
				expect(result.table!.get('totalSale', 3)).toBe('20470')
				expect(result.table!.get('totalSale', 4)).toBe('5000')
			})
		})

		test('decimal to string', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table22',
				output: 'output',
				args: {
					columns: ['value'],
					type: ParseType.String,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(2)
				expect(result.table!.numRows()).toBe(5)
				expect(result.table!.get('value', 0)).toBe('12.35')
				expect(result.table!.get('value', 1)).toBe('86.55')
				expect(result.table!.get('value', 2)).toBe('45.55')
				expect(result.table!.get('value', 3)).toBe('66.35')
				expect(result.table!.get('value', 4)).toBe('78.25')
			})
		})

		test('undefined to string', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['quantity'],
					type: ParseType.String,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(4)
				expect(result.table!.numRows()).toBe(5)
				expect(result.table!.get('quantity', 0)).toBe('45')
				expect(result.table!.get('quantity', 1)).toBeUndefined()
				expect(result.table!.get('quantity', 2)).toBe('100')
				expect(result.table!.get('quantity', 3)).toBe('89')
				expect(result.table!.get('quantity', 4)).toBe('50')
			})
		})

		test('null to string', () => {
			const step: Step = {
				verb: Verb.Convert,
				input: 'table15',
				output: 'output',
				args: {
					columns: ['y'],
					type: ParseType.String,
				},
			}

			const store = new TestStore()

			return convert(step, store).then(result => {
				expect(result.table!.numCols()).toBe(3)
				expect(result.table!.numRows()).toBe(3)
				expect(result.table!.get('y', 0)).toBeNull()
				expect(result.table!.get('y', 1)).toBe('true')
				expect(result.table!.get('y', 2)).toBe('false')
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
