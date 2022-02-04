/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { BinArgs, BinStrategy } from '../..'
import { Step, Verb } from '../../types'
import { bin } from '../verbs/bin'
import { TestStore } from './TestStore'

describe('test for bin verb', () => {
	const base: Step<BinArgs> = {
		verb: Verb.Bin,
		input: 'table9',
		output: 'output',
		args: {
			to: 'newColumn',
			column: 'count',
			strategy: BinStrategy.Auto,
		},
	}

	test('BinStrategy.FixedCount', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedCount,
				fixedcount: 5,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			// 200 - 10 = 190 / 5 bins = 38 step
			expect(b).toEqual([10, 48, 86, 124, 162])
		})
	})

	test('BinStrategy.FixedCount exceeds bounds to Infinity', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedCount,
				fixedcount: 5,
				min: 20,
				max: 150,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			// 150 - 20 = 130 / 5 bins = 26 step
			expect(b).toEqual([20, 46, 72, 98, 124])
			// unclamped should be +- Infinity
			expect(result.get('newColumn', 0)).toBe(-Infinity)
			expect(result.get('newColumn', 19)).toBe(Infinity)
		})
	})

	test('BinStrategy.FixedCount exceeds bounds clamped', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedCount,
				fixedcount: 5,
				min: 20,
				max: 150,
				clamped: true,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			// 150 - 20 = 130 / 5 bins = 26 step
			expect(b).toEqual([20, 46, 72, 98, 124])
			// clamped should get the min value
			expect(result.get('newColumn', 0)).toBe(20)
			// clamped should get penultimate value
			expect(result.get('newColumn', 19)).toBe(124)
		})
	})

	test('BinStrategy.FixedWidth, uneven division results in bin rounding', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedWidth,
				fixedwidth: 30,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			// (200 - 10) = 190 / 30 step = 6.33 so 7 bins
			expect(b).toEqual([10, 40, 70, 100, 130, 160, 190])
		})
	})

	test('BinStrategy.FixedWidth, even division results in exact bin count with last = max', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedWidth,
				fixedwidth: 38,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			// (200 - 10) = 190 / 38 step = 5 bins
			const b = bins(result)
			expect(b).toEqual([10, 48, 86, 124, 162])
		})
	})

	test('BinStrategy.FixedWidth exceeds bounds to Infinity', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedWidth,
				fixedwidth: 30,
				min: 20,
				max: 150,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			// 150 - 20 = 130 / 30 step = 4.33 so 5 bins
			expect(b).toEqual([20, 50, 80, 110, 140])
			// unclamped should be +- Infinity
			expect(result.get('newColumn', 0)).toBe(-Infinity)
			expect(result.get('newColumn', 19)).toBe(Infinity)
		})
	})

	test('BinStrategy.FixedWidth exceeds bounds clamped', () => {
		const step: Step = {
			...base,
			args: {
				...base.args,
				strategy: BinStrategy.FixedWidth,
				fixedwidth: 30,
				min: 20,
				max: 150,
				clamped: true,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			// 150 - 20 = 130 / 30 step = 4.33 so 5 bins
			expect(b).toEqual([20, 50, 80, 110, 140])
			expect(result.get('newColumn', 0)).toBe(20)
			expect(result.get('newColumn', 19)).toBe(140)
		})
	})
})

function bins(table: ColumnTable) {
	const objects = table.objects()
	const values = objects.reduce((acc, cur) => {
		// ignore infinities for bin counting
		if (cur.newColumn > -Infinity && cur.newColumn < Infinity) {
			acc[cur.newColumn] = +cur.newColumn
		}
		return acc
	}, {})
	return Object.values(values)
}
