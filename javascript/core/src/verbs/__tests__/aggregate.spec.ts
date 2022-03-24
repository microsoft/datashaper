/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../../types.js'
import { FieldAggregateOperation, Verb } from '../enums.js'
import { aggregate } from '../stepVerbs.js'
import { TestStore } from './TestStore.js'

describe('test for aggregate verb', () => {
	test('aggregate test with count operation', () => {
		const step: Step = {
			verb: Verb.Aggregate,
			input: 'table3',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				column: 'item',
				operation: FieldAggregateOperation.Count,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
			// one col for id, one for aggregation
			expect(result.table.numCols()).toBe(2)
			// 3 unique ids in table2
			expect(result.table.numRows()).toBe(3)
			//check the aggregated counts
			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('newColumn', 0)).toBe(2)
			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('newColumn', 1)).toBe(1)
			expect(result.table.get('ID', 2)).toBe(4)
			expect(result.table.get('newColumn', 2)).toBe(3)
		})
	})

	test('aggregate test with sum operation', () => {
		const step: Step = {
			verb: Verb.Aggregate,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				column: 'quantity',
				operation: FieldAggregateOperation.Sum,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
			// one col for id, one for aggregation
			expect(result.table.numCols()).toBe(2)
			// 3 unique ids in table2
			expect(result.table.numRows()).toBe(3)
			//check the aggregated counts
			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('newColumn', 0)).toBe(123)
			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('newColumn', 1)).toBe(100)
			expect(result.table.get('ID', 2)).toBe(4)
			expect(result.table.get('newColumn', 2)).toBe(184)
		})
	})

	test('aggregate test with min operation', () => {
		const step: Step = {
			verb: Verb.Aggregate,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				column: 'quantity',
				operation: FieldAggregateOperation.Min,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
			// one col for id, one for aggregation
			expect(result.table.numCols()).toBe(2)
			// 3 unique ids in table2
			expect(result.table.numRows()).toBe(3)
			//check the aggregated counts
			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('newColumn', 0)).toBe(45)
			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('newColumn', 1)).toBe(100)
			expect(result.table.get('ID', 2)).toBe(4)
			expect(result.table.get('newColumn', 2)).toBe(45)
		})
	})

	test('aggregate test with median operation', () => {
		const step: Step = {
			verb: Verb.Aggregate,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				column: 'quantity',
				operation: FieldAggregateOperation.Median,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
			// one col for id, one for aggregation
			expect(result.table.numCols()).toBe(2)
			// 3 unique ids in table2
			expect(result.table.numRows()).toBe(3)
			//check the aggregated counts
			expect(result.table.get('ID', 0)).toBe(1)
			expect(result.table.get('newColumn', 0)).toBe(61.5)
			expect(result.table.get('ID', 1)).toBe(2)
			expect(result.table.get('newColumn', 1)).toBe(100)
			expect(result.table.get('ID', 2)).toBe(4)
			expect(result.table.get('newColumn', 2)).toBe(50)
		})
	})
})
