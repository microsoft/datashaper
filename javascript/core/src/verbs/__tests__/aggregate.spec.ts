/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { aggregateStep } from '../stepFunctions/index.js'
import { FieldAggregateOperation } from '../types/enums.js'
import { TestStore } from './TestStore.js'

describe('test for aggregate verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore('table4')
	})

	test('aggregate test with count operation', () => {
		const result = aggregateStep(store.table('table3'), {
			to: 'newColumn',
			groupby: 'ID',
			column: 'item',
			operation: FieldAggregateOperation.Count,
		})
		// one col for id, one for aggregation
		expect(result.numCols()).toBe(2)
		// 3 unique ids in table2
		expect(result.numRows()).toBe(3)
		//check the aggregated counts
		expect(result.get('ID', 0)).toBe(1)
		expect(result.get('newColumn', 0)).toBe(2)
		expect(result.get('ID', 1)).toBe(2)
		expect(result.get('newColumn', 1)).toBe(1)
		expect(result.get('ID', 2)).toBe(4)
		expect(result.get('newColumn', 2)).toBe(3)
	})

	test('aggregate test with sum operation', () => {
		const result = aggregateStep(store.table(), {
			to: 'newColumn',
			groupby: 'ID',
			column: 'quantity',
			operation: FieldAggregateOperation.Sum,
		})

		// one col for id, one for aggregation
		expect(result.numCols()).toBe(2)
		// 3 unique ids in table2
		expect(result.numRows()).toBe(3)
		//check the aggregated counts
		expect(result.get('ID', 0)).toBe(1)
		expect(result.get('newColumn', 0)).toBe(123)
		expect(result.get('ID', 1)).toBe(2)
		expect(result.get('newColumn', 1)).toBe(100)
		expect(result.get('ID', 2)).toBe(4)
		expect(result.get('newColumn', 2)).toBe(184)
	})

	test('aggregate test with min operation', () => {
		const result = aggregateStep(store.table(), {
			to: 'newColumn',
			groupby: 'ID',
			column: 'quantity',
			operation: FieldAggregateOperation.Min,
		})

		// one col for id, one for aggregation
		expect(result.numCols()).toBe(2)
		// 3 unique ids in table2
		expect(result.numRows()).toBe(3)
		//check the aggregated counts
		expect(result.get('ID', 0)).toBe(1)
		expect(result.get('newColumn', 0)).toBe(45)
		expect(result.get('ID', 1)).toBe(2)
		expect(result.get('newColumn', 1)).toBe(100)
		expect(result.get('ID', 2)).toBe(4)
		expect(result.get('newColumn', 2)).toBe(45)
	})

	test('aggregate test with median operation', () => {
		const result = aggregateStep(store.table(), {
			to: 'newColumn',
			groupby: 'ID',
			column: 'quantity',
			operation: FieldAggregateOperation.Median,
		})
		// one col for id, one for aggregation
		expect(result.numCols()).toBe(2)
		// 3 unique ids in table2
		expect(result.numRows()).toBe(3)
		//check the aggregated counts
		expect(result.get('ID', 0)).toBe(1)
		expect(result.get('newColumn', 0)).toBe(61.5)
		expect(result.get('ID', 1)).toBe(2)
		expect(result.get('newColumn', 1)).toBe(100)
		expect(result.get('ID', 2)).toBe(4)
		expect(result.get('newColumn', 2)).toBe(50)
	})
})
