/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { mergeStep, MergeStrategy } from '../merge.js'

describe('test for merge verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	describe('MergeStrategy.concat', () => {
		test('numeric values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['quantity', 'totalSale'],
				strategy: MergeStrategy.Concat,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe('4554000')
			expect(result.get('resultColumn', 1)).toBe('7800')
			expect(result.get('resultColumn', 2)).toBe('100230000')
			expect(result.get('resultColumn', 3)).toBe('8920470')
			expect(result.get('resultColumn', 4)).toBe('505000')
		})

		test('string values', async () => {
			const result = await mergeStep(store.table('table13'), {
				columns: ['name', 'description'],
				strategy: MergeStrategy.Concat,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe('AXX')
			expect(result.get('resultColumn', 1)).toBe('BXT')
			expect(result.get('resultColumn', 2)).toBe('CQW')
			expect(result.get('resultColumn', 3)).toBe('DRE')
			expect(result.get('resultColumn', 4)).toBe('EFG')
		})

		test('numeric and string mixed values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['item', 'quantity'],
				strategy: MergeStrategy.Concat,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe('bed45')
			expect(result.get('resultColumn', 1)).toBe('pillow')
			expect(result.get('resultColumn', 2)).toBe('100')
			expect(result.get('resultColumn', 3)).toBe('chair89')
			expect(result.get('resultColumn', 4)).toBe('stool50')
		})

		test('string values with delimiter', async () => {
			const result = await mergeStep(store.table('table13'), {
				columns: ['name', 'description'],
				strategy: MergeStrategy.Concat,
				to: 'resultColumn',
				delimiter: ',',
			})

			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe('A,XX')
			expect(result.get('resultColumn', 1)).toBe('B,XT')
			expect(result.get('resultColumn', 2)).toBe('C,QW')
			expect(result.get('resultColumn', 3)).toBe('D,RE')
			expect(result.get('resultColumn', 4)).toBe('E,FG')
		})
	})

	describe('MergeStrategy.FirstOneWins', () => {
		test('string and numeric mixed values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['item', 'quantity'],
				strategy: MergeStrategy.FirstOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe('bed')
			expect(result.get('resultColumn', 1)).toBe('pillow')
			expect(result.get('resultColumn', 2)).toBe('100')
			expect(result.get('resultColumn', 3)).toBe('chair')
			expect(result.get('resultColumn', 4)).toBe('stool')
		})

		test('numeric values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['quantity', 'totalSale'],
				strategy: MergeStrategy.FirstOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe(45)
			expect(result.get('resultColumn', 1)).toBe(7800)
			expect(result.get('resultColumn', 2)).toBe(100)
			expect(result.get('resultColumn', 3)).toBe(89)
			expect(result.get('resultColumn', 4)).toBe(50)
		})

		test('boolean and string mixed values', async () => {
			const result = await mergeStep(store.table('table14'), {
				columns: ['y', 'z'],
				strategy: MergeStrategy.FirstOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(3)
			expect(result.get('resultColumn', 0)).toBe('1')
			expect(result.get('resultColumn', 1)).toBe('false')
			expect(result.get('resultColumn', 2)).toBe('1')
		})

		test('boolean values', async () => {
			const result = await mergeStep(store.table('table15'), {
				columns: ['y', 'z'],
				strategy: MergeStrategy.FirstOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(3)
			expect(result.get('resultColumn', 0)).toBe(true)
			expect(result.get('resultColumn', 1)).toBe(true)
			expect(result.get('resultColumn', 2)).toBe(false)
		})
	})

	describe('MergeStrategy.LastOneWins', () => {
		test('string and numeric mixed values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['item', 'quantity'],
				strategy: MergeStrategy.LastOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe('45')
			expect(result.get('resultColumn', 1)).toBe('pillow')
			expect(result.get('resultColumn', 2)).toBe('100')
			expect(result.get('resultColumn', 3)).toBe('89')
			expect(result.get('resultColumn', 4)).toBe('50')
		})

		test('numeric values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['quantity', 'totalSale'],
				strategy: MergeStrategy.LastOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toBe(54000)
			expect(result.get('resultColumn', 1)).toBe(7800)
			expect(result.get('resultColumn', 2)).toBe(230000)
			expect(result.get('resultColumn', 3)).toBe(20470)
			expect(result.get('resultColumn', 4)).toBe(5000)
		})

		test('boolean and string mixed values', async () => {
			const result = await mergeStep(store.table('table14'), {
				columns: ['y', 'z'],
				strategy: MergeStrategy.LastOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(3)
			expect(result.get('resultColumn', 0)).toBe('true')
			expect(result.get('resultColumn', 1)).toBe('false')
			expect(result.get('resultColumn', 2)).toBe('false')
		})

		test('boolean values', async () => {
			const result = await mergeStep(store.table('table15'), {
				columns: ['y', 'z'],
				strategy: MergeStrategy.LastOneWins,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(4)
			expect(result.numRows()).toBe(3)
			expect(result.get('resultColumn', 0)).toBe(true)
			expect(result.get('resultColumn', 1)).toBe(false)
			expect(result.get('resultColumn', 2)).toBe(true)
		})
	})

	describe('MergeStrategy.array', () => {
		test('numeric values', async () => {
			const result = await mergeStep(store.table('table12'), {
				columns: ['quantity', 'totalSale'],
				strategy: MergeStrategy.CreateArray,
				to: 'resultColumn',
			})

			expect(result.numCols()).toBe(5)
			expect(result.numRows()).toBe(5)
			expect(result.get('resultColumn', 0)).toEqual([45, 54000])
			expect(result.get('resultColumn', 1)).toEqual([7800])
			expect(result.get('resultColumn', 2)).toEqual([100, 230000])
			expect(result.get('resultColumn', 3)).toEqual([89, 20470])
			expect(result.get('resultColumn', 4)).toEqual([50, 5000])
		})
	})
})
