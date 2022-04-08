/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { FieldAggregateOperation } from '../../index.js'
import { pivotStep } from '../pivot.js'

describe('test for pivot verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})
	test('pivot test with any operation', async () => {
		const result = await pivotStep(store.table('table16'), {
			key: 'key',
			value: 'value',
			operation: FieldAggregateOperation.Any,
		})

		expect(result.numCols()).toBe(3)
		expect(result.numRows()).toBe(1)
		expect(result.get('A', 0)).toBe(1)
		expect(result.get('B', 0)).toBe(2)
		expect(result.get('C', 0)).toBe(3)
	})

	test('pivot test with sum operation', async () => {
		const result = await pivotStep(store.table('table17'), {
			key: 'name',
			value: 'count',
			operation: FieldAggregateOperation.Sum,
		})
		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(1)
		expect(result.get('A', 0)).toBe(7)
		expect(result.get('B', 0)).toBe(8)
	})

	test('pivot test with max operation', async () => {
		const result = await pivotStep(store.table('table17'), {
			key: 'name',
			value: 'count',
			operation: FieldAggregateOperation.Max,
		})

		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(1)
		expect(result.get('A', 0)).toBe(4)
		expect(result.get('B', 0)).toBe(5)
	})

	test('pivot test with min operation', async () => {
		const result = await pivotStep(store.table('table17'), {
			key: 'name',
			value: 'count',
			operation: FieldAggregateOperation.Min,
		})

		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(1)
		expect(result.get('A', 0)).toBe(1)
		expect(result.get('B', 0)).toBe(3)
	})

	test('pivot test with mean operation', async () => {
		const result = await pivotStep(store.table('table17'), {
			key: 'name',
			value: 'count',
			operation: FieldAggregateOperation.Mean,
		})

		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(1)
		expect(result.get('A', 0)).toBe(2.3333333333333335)
		expect(result.get('B', 0)).toBe(4)
	})

	test('pivot test with median operation', async () => {
		const result = await pivotStep(store.table('table17'), {
			key: 'name',
			value: 'count',
			operation: FieldAggregateOperation.Median,
		})

		expect(result.numCols()).toBe(2)
		expect(result.numRows()).toBe(1)
		expect(result.get('A', 0)).toBe(2)
		expect(result.get('B', 0)).toBe(4)
	})
})
