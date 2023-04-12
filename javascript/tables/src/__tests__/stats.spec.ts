/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { stats } from '../stats.js'

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

	describe('stats', () => {
		const result = stats(tbl)

		test('numeric stats', () => {
			const { num } = result
			expect(num?.count).toBe(6)
			expect(num?.distinct).toBe(5)
			expect(num?.invalid).toBe(0)
			expect(num?.mode).toBe(3)
			expect(num?.minimum).toBe(1)
			expect(num?.maximum).toBe(5)
			expect(num?.mean).toBe(3)
			// for our default stats we specify 10 bins
			// if there are less than 10 rows in the table it can be smaller
			expect(num?.bins).toHaveLength(5)
		})

		test('string stats', () => {
			const { str } = result
			expect(str?.count).toBe(6)
			expect(str?.distinct).toBe(4)
			expect(str?.invalid).toBe(0)
			expect(str?.mode).toBe('B')
			// should be no numeric stats
			expect(str?.minimum).toBeUndefined()
		})

		test('missing numeric values', () => {
			const { inv } = result
			expect(inv?.count).toBe(6)
			expect(inv?.distinct).toBe(3)
			expect(inv?.invalid).toBe(4)
			// tie breaker is the first
			expect(inv?.mode).toBe(1)
			// mean should not include empties
			expect(inv?.mean).toBe(1.5)
		})

		test('boolean stats', () => {
			const { bool } = result
			expect(bool?.count).toBe(6)
			expect(bool?.distinct).toBe(3)
			expect(bool?.invalid).toBe(1)
			expect(bool?.mode).toBe(true)
			// should be no numeric stats
			expect(bool?.minimum).toBeUndefined()
		})

		test('date stats', () => {
			const { date } = result
			expect(date?.count).toBe(6)
			expect(date?.distinct).toBe(3)
			expect(date?.invalid).toBe(4)
			expect(date?.mode).toBe(d1)
			// should be no numeric stats
			expect(date?.minimum).toBeUndefined()
		})

		test('array stats', () => {
			const { arr } = result
			expect(arr?.count).toBe(6)
			expect(arr?.distinct).toBe(4)
			expect(arr?.invalid).toBe(3)
			expect(arr?.mode).toStrictEqual([1, 2, 3])
			// should be no numeric stats
			expect(arr?.minimum).toBeUndefined()
		})

		test('column subsets are honored', () => {
			const result = stats(tbl, ['num'])
			expect(Object.keys(result)).toHaveLength(1)
		})

		describe('bins', () => {
			// for our default stats we specify 10 bins - let's test with a column that has enough rows for this
			test('exactly 10 distinct', () => {
				const binnable: ColumnTable = table({
					values: [8, 9, 10, 1, 2, 3, 3, 4, 5, 6, 6, 6, 6, 6, 7],
				})
				const { values } = stats(binnable)
				expect(values?.count).toBe(15)
				expect(values?.distinct).toBe(10)
				const bins = values?.bins
				expect(bins).toHaveLength(10)
				// ensure the bins are sorted ascending numerically
				expect(bins[0]?.min).toBe(1)
			})

			test('more than 10 distinct, still 10 bins', () => {
				const binnable: ColumnTable = table({
					values: [
						8, 9, 10, 1, 2, 3, 3, 4, 5, 6, 6, 6, 6, 6, 7, 11, 12, 13, 14,
					],
				})
				const { values } = stats(binnable)
				expect(values?.count).toBe(19)
				expect(values?.distinct).toBe(14)
				const bins = values?.bins
				expect(bins).toHaveLength(10)
				// ensure the bins are sorted ascending numerically
				expect(bins[0]?.min).toBe(1)
			})

			test('null values add one bonus bin', () => {
				const binnable: ColumnTable = table({
					values: [
						null,
						null,
						undefined,
						8,
						9,
						10,
						1,
						2,
						3,
						3,
						4,
						5,
						6,
						6,
						6,
						6,
						6,
						7,
						11,
						12,
						13,
						14,
					],
				})
				const { values } = stats(binnable)
				expect(values?.count).toBe(22)
				expect(values?.distinct).toBe(15)
				const bins = values?.bins
				expect(bins).toHaveLength(11)
				// ensure the bins are sorted ascending numerically
				expect(bins?.[0]?.min).toBe('(empty)')
			})

			test('less than 10 distinct will use unique values', () => {
				const binnable: ColumnTable = table({
					values: [8, 9, 1, 2, 3, 3, 4, 5, 6, 6, 6, 6, 6],
				})
				const { values } = stats(binnable)
				expect(values?.count).toBe(13)
				expect(values?.distinct).toBe(8)
				const bins = values?.bins
				expect(bins).toHaveLength(8)
				const mins = bins.map((b) => b.min)
				expect(mins).toEqual([1, 2, 3, 4, 5, 6, 8, 9])
			})

			test('empty bins are filled in to complete 10', () => {
				const binnable: ColumnTable = table({
					values: [1, 2, 3, 4, 50, 60, 61, 61, 100, 101, 102, 1000, 1001],
				})
				const { values } = stats(binnable)
				expect(values?.count).toBe(13)
				expect(values?.distinct).toBe(12)
				const bins = values?.bins
				expect(bins).toHaveLength(10)
				// ensure the bins are sorted ascending numerically
				expect(bins?.[0]?.min).toBe(1)
			})

			test('empty bins are filled in to complete 10, nulls still add one bin', () => {
				const binnable: ColumnTable = table({
					values: [
						1,
						2,
						3,
						4,
						50,
						60,
						61,
						61,
						100,
						101,
						102,
						1000,
						1001,
						null,
						null,
					],
				})
				const { values } = stats(binnable)
				expect(values.count).toBe(15)
				expect(values.distinct).toBe(13)
				const bins = values.bins
				expect(bins).toHaveLength(11)
				// ensure the bins are sorted ascending numerically
				expect(bins[0]?.min).toBe('(empty)')
			})
		})

		test('categories', () => {
			const categorical: ColumnTable = table({
				/* eslint-disable no-sparse-arrays */
				values: ['one', 'two', 'one', 'one', 'three', undefined, 'four'],
			})
			const { values } = stats(categorical)
			expect(values?.count).toBe(7)
			expect(values?.distinct).toBe(5)
			const categories = values?.categories
			// logically the categories should match the unique values
			expect(categories).toHaveLength(values?.distinct as number)
			// empties will be sorted first
			expect(categories[0]?.name).toBe('(empty)')
			expect(categories[0]?.count).toBe(1)
			// the rest alpha
			expect(categories[1]?.name).toBe('four')
			expect(categories[1]?.count).toBe(1)
		})
	})
})
