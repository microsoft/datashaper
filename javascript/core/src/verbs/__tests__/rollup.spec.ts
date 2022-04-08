/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { rollupStep } from '../rollup.js'
import { FieldAggregateOperation } from '../types.js'

describe('test for rollup verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('rollup test with count operation', async () => {
		const result = await rollupStep(store.table('table3'), {
			to: 'count',
			column: 'item',
			operation: FieldAggregateOperation.Count,
		})

		expect(result.numCols()).toBe(1)
		expect(result.numRows()).toBe(1)
		expect(result.get('count', 0)).toBe(6)
	})

	test('rollup test with sum operation', async () => {
		const result = await rollupStep(store.table('table4'), {
			to: 'total',
			column: 'quantity',
			operation: FieldAggregateOperation.Sum,
		})

		expect(result.numCols()).toBe(1)
		expect(result.numRows()).toBe(1)
		expect(result.get('total', 0)).toBe(407)
	})

	test('rollup test with min operation', async () => {
		const result = await rollupStep(store.table('table4'), {
			to: 'min',
			column: 'quantity',
			operation: FieldAggregateOperation.Min,
		})

		expect(result.numCols()).toBe(1)
		expect(result.numRows()).toBe(1)
		expect(result.get('min', 0)).toBe(45)
	})
})
