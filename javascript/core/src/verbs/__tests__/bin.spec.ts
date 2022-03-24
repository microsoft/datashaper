/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { TestStore } from '../../__tests__/TestStore.js'
import type { BinArgs } from '../../index.js'
import { BinStrategy } from '../../index.js'
import { binStep } from '../stepFunctions/bin.js'

describe('test for bin verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table9')
	})

	const baseArgs: BinArgs = {
		to: 'newColumn',
		column: 'count',
		strategy: BinStrategy.Auto,
	}

	test('BinStrategy.FixedCount', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedCount,
			fixedcount: 5,
		})

		const b = bins(result)
		// 200 - 10 = 190 / 5 bins = 38 step
		expect(b).toEqual([10, 48, 86, 124, 162])
	})

	test('BinStrategy.FixedCount exceeds bounds to Infinity', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedCount,
			fixedcount: 5,
			min: 20,
			max: 150,
		})
		const b = bins(result)
		// 150 - 20 = 130 / 5 bins = 26 step
		expect(b).toEqual([20, 46, 72, 98, 124])
		// unclamped should be +- Infinity
		expect(result.get('newColumn', 0)).toBe(-Infinity)
		expect(result.get('newColumn', 19)).toBe(Infinity)
	})

	test('BinStrategy.FixedCount exceeds bounds clamped', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedCount,
			fixedcount: 5,
			min: 20,
			max: 150,
			clamped: true,
		})
		const b = bins(result)
		// 150 - 20 = 130 / 5 bins = 26 step
		expect(b).toEqual([20, 46, 72, 98, 124])
		// clamped should get the min value
		expect(result.get('newColumn', 0)).toBe(20)
		// clamped should get penultimate value
		expect(result.get('newColumn', 19)).toBe(124)
	})

	test('BinStrategy.FixedWidth, uneven division results in bin rounding', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedWidth,
			fixedwidth: 30,
		})
		const b = bins(result)
		// (200 - 10) = 190 / 30 step = 6.33 so 7 bins
		expect(b).toEqual([10, 40, 70, 100, 130, 160, 190])
	})

	test('BinStrategy.FixedWidth, even division results in exact bin count with last = max', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedWidth,
			fixedwidth: 38,
		})
		// (200 - 10) = 190 / 38 step = 5 bins
		const b = bins(result)
		expect(b).toEqual([10, 48, 86, 124, 162])
	})

	test('BinStrategy.FixedWidth exceeds bounds to Infinity', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedWidth,
			fixedwidth: 30,
			min: 20,
			max: 150,
		})
		const b = bins(result)
		// 150 - 20 = 130 / 30 step = 4.33 so 5 bins
		expect(b).toEqual([20, 50, 80, 110, 140])
		// unclamped should be +- Infinity
		expect(result.get('newColumn', 0)).toBe(-Infinity)
		expect(result.get('newColumn', 19)).toBe(Infinity)
	})

	test('BinStrategy.FixedWidth exceeds bounds clamped', () => {
		const result = binStep(store.table(), {
			...baseArgs,
			strategy: BinStrategy.FixedWidth,
			fixedwidth: 30,
			min: 20,
			max: 150,
			clamped: true,
		})
		const b = bins(result)
		// 150 - 20 = 130 / 30 step = 4.33 so 5 bins
		expect(b).toEqual([20, 50, 80, 110, 140])
		expect(result.get('newColumn', 0)).toBe(20)
		expect(result.get('newColumn', 19)).toBe(140)
	})
})

function bins(table: ColumnTable) {
	const objects = table.objects()
	const values = objects.reduce((acc, cur: any) => {
		// ignore infinities for bin counting
		if (cur.newColumn > -Infinity && cur.newColumn < Infinity) {
			acc[cur.newColumn] = +cur.newColumn
		}
		return acc
	}, {} as any)
	return Object.values(values)
}
