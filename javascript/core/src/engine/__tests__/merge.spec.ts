/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MergeStrategy } from '../../index.js'
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { merge } from '../verbs/merge.js'
import { TestStore } from './TestStore.js'

describe('test for merge verb', () => {
	describe('MergeStrategy.concat', () => {
		test('numeric values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['quantity', 'totalSale'],
					strategy: MergeStrategy.Concat,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe('4554000')
				expect(result.table.get('resultColumn', 1)).toBe('7800')
				expect(result.table.get('resultColumn', 2)).toBe('100230000')
				expect(result.table.get('resultColumn', 3)).toBe('8920470')
				expect(result.table.get('resultColumn', 4)).toBe('505000')
			})
		})

		test('string values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table13',
				output: 'output',
				args: {
					columns: ['name', 'description'],
					strategy: MergeStrategy.Concat,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(4)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe('AXX')
				expect(result.table.get('resultColumn', 1)).toBe('BXT')
				expect(result.table.get('resultColumn', 2)).toBe('CQW')
				expect(result.table.get('resultColumn', 3)).toBe('DRE')
				expect(result.table.get('resultColumn', 4)).toBe('EFG')
			})
		})

		test('numeric and string mixed values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['item', 'quantity'],
					strategy: MergeStrategy.Concat,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe('bed45')
				expect(result.table.get('resultColumn', 1)).toBe('pillow')
				expect(result.table.get('resultColumn', 2)).toBe('100')
				expect(result.table.get('resultColumn', 3)).toBe('chair89')
				expect(result.table.get('resultColumn', 4)).toBe('stool50')
			})
		})

		test('string values with delimiter', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table13',
				output: 'output',
				args: {
					columns: ['name', 'description'],
					strategy: MergeStrategy.Concat,
					to: 'resultColumn',
					delimiter: ',',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(4)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe('A,XX')
				expect(result.table.get('resultColumn', 1)).toBe('B,XT')
				expect(result.table.get('resultColumn', 2)).toBe('C,QW')
				expect(result.table.get('resultColumn', 3)).toBe('D,RE')
				expect(result.table.get('resultColumn', 4)).toBe('E,FG')
			})
		})
	})

	describe('MergeStrategy.FirstOneWins', () => {
		test('string and numeric mixed values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['item', 'quantity'],
					strategy: MergeStrategy.FirstOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe('bed')
				expect(result.table.get('resultColumn', 1)).toBe('pillow')
				expect(result.table.get('resultColumn', 2)).toBe('100')
				expect(result.table.get('resultColumn', 3)).toBe('chair')
				expect(result.table.get('resultColumn', 4)).toBe('stool')
			})
		})

		test('numeric values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['quantity', 'totalSale'],
					strategy: MergeStrategy.FirstOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe(45)
				expect(result.table.get('resultColumn', 1)).toBe(7800)
				expect(result.table.get('resultColumn', 2)).toBe(100)
				expect(result.table.get('resultColumn', 3)).toBe(89)
				expect(result.table.get('resultColumn', 4)).toBe(50)
			})
		})

		test('boolean and string mixed values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table14',
				output: 'output',
				args: {
					columns: ['y', 'z'],
					strategy: MergeStrategy.FirstOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(4)
				expect(result.table.numRows()).toBe(3)
				expect(result.table.get('resultColumn', 0)).toBe('1')
				expect(result.table.get('resultColumn', 1)).toBe('false')
				expect(result.table.get('resultColumn', 2)).toBe('1')
			})
		})

		test('boolean values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table15',
				output: 'output',
				args: {
					columns: ['y', 'z'],
					strategy: MergeStrategy.FirstOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(4)
				expect(result.table.numRows()).toBe(3)
				expect(result.table.get('resultColumn', 0)).toBe(true)
				expect(result.table.get('resultColumn', 1)).toBe(true)
				expect(result.table.get('resultColumn', 2)).toBe(false)
			})
		})
	})

	describe('MergeStrategy.LastOneWins', () => {
		test('string and numeric mixed values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['item', 'quantity'],
					strategy: MergeStrategy.LastOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe('45')
				expect(result.table.get('resultColumn', 1)).toBe('pillow')
				expect(result.table.get('resultColumn', 2)).toBe('100')
				expect(result.table.get('resultColumn', 3)).toBe('89')
				expect(result.table.get('resultColumn', 4)).toBe('50')
			})
		})

		test('numeric values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['quantity', 'totalSale'],
					strategy: MergeStrategy.LastOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toBe(54000)
				expect(result.table.get('resultColumn', 1)).toBe(7800)
				expect(result.table.get('resultColumn', 2)).toBe(230000)
				expect(result.table.get('resultColumn', 3)).toBe(20470)
				expect(result.table.get('resultColumn', 4)).toBe(5000)
			})
		})

		test('boolean and string mixed values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table14',
				output: 'output',
				args: {
					columns: ['y', 'z'],
					strategy: MergeStrategy.LastOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(4)
				expect(result.table.numRows()).toBe(3)
				expect(result.table.get('resultColumn', 0)).toBe('true')
				expect(result.table.get('resultColumn', 1)).toBe('false')
				expect(result.table.get('resultColumn', 2)).toBe('false')
			})
		})

		test('boolean values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table15',
				output: 'output',
				args: {
					columns: ['y', 'z'],
					strategy: MergeStrategy.LastOneWins,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(4)
				expect(result.table.numRows()).toBe(3)
				expect(result.table.get('resultColumn', 0)).toBe(true)
				expect(result.table.get('resultColumn', 1)).toBe(false)
				expect(result.table.get('resultColumn', 2)).toBe(true)
			})
		})
	})

	describe('MergeStrategy.array', () => {
		test('numeric values', () => {
			const step: Step = {
				verb: Verb.Merge,
				input: 'table12',
				output: 'output',
				args: {
					columns: ['quantity', 'totalSale'],
					strategy: MergeStrategy.CreateArray,
					to: 'resultColumn',
				},
			}

			const store = new TestStore()

			return merge(step, store).then(result => {
				expect(result.table.numCols()).toBe(5)
				expect(result.table.numRows()).toBe(5)
				expect(result.table.get('resultColumn', 0)).toEqual([45, 54000])
				expect(result.table.get('resultColumn', 1)).toEqual([7800])
				expect(result.table.get('resultColumn', 2)).toEqual([100, 230000])
				expect(result.table.get('resultColumn', 3)).toEqual([89, 20470])
				expect(result.table.get('resultColumn', 4)).toEqual([50, 5000])
			})
		})
	})
})
