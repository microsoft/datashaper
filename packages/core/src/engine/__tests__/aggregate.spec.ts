/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateOperation } from '../../../../core'
import { Step, StepType, Verb } from '../../types'
import { aggregate } from '../verbs/aggregate'
import { TestStore } from './TestStore'

describe('test for aggregate verb', () => {
	test('aggregate test with count operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Aggregate,
			input: 'table3',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				field: 'item',
				operation: FieldAggregateOperation.Count,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
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
	})

	test('aggregate test with sum operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Aggregate,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				field: 'quantity',
				operation: FieldAggregateOperation.Sum,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
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
	})

	test('aggregate test with min operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Aggregate,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				field: 'quantity',
				operation: FieldAggregateOperation.Min,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
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
	})

	test('aggregate test with median operation', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Aggregate,
			input: 'table4',
			output: 'output',
			args: {
				to: 'newColumn',
				groupby: 'ID',
				field: 'quantity',
				operation: FieldAggregateOperation.Median,
			},
		}

		const store = new TestStore()

		return aggregate(step, store).then(result => {
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
})
